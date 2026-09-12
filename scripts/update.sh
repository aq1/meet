#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if command -v flock >/dev/null 2>&1; then
  exec 9>".update.lock"
  if ! flock -n 9; then
    echo "==> Another update is already running. Exiting."
    exit 0
  fi
else
  LOCK_DIR=".update.lock.d"
  if ! mkdir "$LOCK_DIR" 2>/dev/null; then
    echo "==> Another update is already running. Exiting."
    exit 0
  fi
  trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT
fi

CONTAINER="meet"
BRANCH="${BRANCH:-main}"
STATE_FILE=".last-deployed-commit"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

notify() {
  local message="$1"
  if [ -z "${TELEGRAM_TOKEN:-}" ] || [ -z "${TELEGRAM_ADMINS:-}" ]; then
    return 0
  fi
  local chat_id
  IFS=',' read -ra chat_ids <<< "$TELEGRAM_ADMINS"
  for chat_id in "${chat_ids[@]}"; do
    chat_id="${chat_id//[[:space:]]/}"
    [ -n "$chat_id" ] || continue
    curl -sf -m 10 \
      "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
      -d "chat_id=${chat_id}" \
      -d "text=${message}" \
      -d "disable_web_page_preview=true" >/dev/null || true
  done
}

trap 'notify "❌ meet update failed (line $LINENO). See server logs."' ERR

ensure_goose() {
  if command -v goose >/dev/null 2>&1; then
    return 0
  fi
  echo "==> goose not found. Installing..."
  local install_dir="${GOOSE_INSTALL:-/usr/local}"
  local -a runner=(env "GOOSE_INSTALL=$install_dir" sh)
  if [ ! -w "${install_dir}/bin" ] && [ ! -w "$install_dir" ]; then
    runner=(sudo "${runner[@]}")
  fi
  curl -fsSL https://raw.githubusercontent.com/pressly/goose/master/install.sh | "${runner[@]}"
  export PATH="${install_dir}/bin:$PATH"
  command -v goose >/dev/null 2>&1 || { echo "==> goose installation failed." >&2; return 1; }
  echo "==> goose installed: $(goose --version)"
}

ensure_goose

echo "==> Fetching latest from git ($BRANCH)..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
AFTER="$(git rev-parse HEAD)"
DEPLOYED="$(cat "$STATE_FILE" 2>/dev/null || true)"

if [ "$AFTER" = "$DEPLOYED" ]; then
  echo "==> Already built and deployed ($(git rev-parse --short HEAD)). Nothing to do."
  exit 0
fi

COMMIT="$(git rev-parse --short HEAD)"

echo "==> Building image ($CONTAINER) @ $COMMIT..."
docker compose build "$CONTAINER"

echo "==> Running database migrations..."
GOOSE_DRIVER=postgres GOOSE_DBSTRING="$DATABASE_URL" GOOSE_MIGRATION_DIR=migrations goose up

echo "==> Starting container ($CONTAINER)..."
docker compose up -d

echo "==> Cleaning up dangling images..."
docker image prune -f

echo "$AFTER" > "$STATE_FILE"

SUBJECT="$(git log -1 --pretty=%s)"
echo "==> Done. $CONTAINER is running."
notify "✅ meet updated and restarted on $BRANCH @ ${COMMIT}: ${SUBJECT}"
