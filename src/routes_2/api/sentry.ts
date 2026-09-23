import { createFileRoute } from "@tanstack/react-router";
import { SENTRY_DSN } from "#/lib/sentry";

const dsn = new URL(SENTRY_DSN);
const projectId = dsn.pathname.slice(1);
const upstream = `https://${dsn.host}/api/${projectId}/envelope/`;

function envelopeDsn(envelope: Uint8Array) {
  const newline = envelope.indexOf(10);
  const header = new TextDecoder().decode(
    newline === -1 ? envelope : envelope.subarray(0, newline),
  );
  try {
    return JSON.parse(header).dsn as unknown;
  } catch {
    return undefined;
  }
}

export const Route = createFileRoute("/api/sentry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const envelope = new Uint8Array(await request.arrayBuffer());
        if (envelopeDsn(envelope) !== SENTRY_DSN) {
          return new Response(null, { status: 400 });
        }
        const res = await fetch(upstream, {
          method: "POST",
          body: envelope,
          headers: { "Content-Type": "application/x-sentry-envelope" },
        });
        return new Response(null, { status: res.status });
      },
    },
  },
});
