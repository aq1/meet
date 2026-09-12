import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";

const root = join(import.meta.dir, "..");
process.chdir(root);
$.cwd(root);

const CONTAINER = "meet";
const STATE_FILE = ".last-deployed-commit";
const LOCK_DIR = ".update.lock.d";
const LOG_FILE = process.env.UPDATE_LOG ?? "/srv/logs/update.log";
const LOG_TAIL_LINES = 20;
const LOG_TAIL_MAX_CHARS = 3000;

let currentStep = "starting";

const log = (message: string) => {
  currentStep = message;
  console.log(`==> ${message}`);
};

const loadEnv = async (path: string) => {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return;
  }
  for (const line of (await file.text()).split("\n")) {
    const match = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/,
    );
    if (!match) {
      continue;
    }
    const [, key, raw] = match;
    const quoted = /^(["']).*\1$/.test(raw);
    process.env[key] = quoted ? raw.slice(1, -1) : raw;
  }
};

const notify = async (text: string) => {
  const token = process.env.TELEGRAM_TOKEN;
  const admins = process.env.TELEGRAM_ADMINS;
  if (!token || !admins) {
    return;
  }
  const chatIds = admins
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          body: new URLSearchParams({
            chat_id: chatId,
            text,
            disable_web_page_preview: "true",
          }),
          signal: AbortSignal.timeout(10_000),
        });
      } catch {}
    }),
  );
};

const tailLog = async () => {
  if (!(await Bun.file(LOG_FILE).exists())) {
    return "";
  }
  const text = await $`tail -n ${LOG_TAIL_LINES} ${LOG_FILE}`.nothrow().text();
  return text.trim().slice(-LOG_TAIL_MAX_CHARS);
};

const acquireLock = () => {
  try {
    mkdirSync(LOCK_DIR);
  } catch {
    return false;
  }
  const release = () => rmSync(LOCK_DIR, { recursive: true, force: true });
  process.on("exit", release);
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"] as const) {
    process.on(signal, () => process.exit(1));
  }
  return true;
};

const deploy = async () => {
  const branch = process.env.BRANCH ?? "main";

  log(`Fetching latest from git (${branch})...`);
  await $`git fetch origin ${branch}`;
  await $`git reset --hard origin/${branch}`;
  const after = (await $`git rev-parse HEAD`.text()).trim();
  const commit = (await $`git rev-parse --short HEAD`.text()).trim();

  const stateFile = Bun.file(STATE_FILE);
  const deployed = (await stateFile.exists())
    ? (await stateFile.text()).trim()
    : "";

  if (after === deployed) {
    log(`Already built and deployed (${commit}). Nothing to do.`);
    return;
  }

  log(`Building image (${CONTAINER}) @ ${commit}...`);
  await $`docker compose build ${CONTAINER}`;

  log("Running database migrations...");
  await $`goose up`;

  log(`Starting container (${CONTAINER})...`);
  await $`docker compose up -d`;

  log("Cleaning up dangling images...");
  await $`docker image prune -f`;

  await Bun.write(STATE_FILE, `${after}\n`);

  const subject = (await $`git log -1 --pretty=%s`.text()).trim();
  log(`Done. ${CONTAINER} is running.`);
  await notify(
    `✅ meet updated and restarted on ${branch} @ ${commit}: ${subject}`,
  );
};

if (!acquireLock()) {
  log("Another update is already running. Exiting.");
  process.exit(0);
}

await loadEnv(".env");

try {
  await deploy();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(error);
  const tail = await tailLog();
  const details = tail
    ? `\n\nLast lines of ${LOG_FILE}:\n${tail}`
    : " See server logs.";
  await notify(
    `❌ meet update failed at "${currentStep}": ${message}.${details}`,
  );
  process.exit(1);
}
