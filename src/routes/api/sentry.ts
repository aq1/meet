import { createFileRoute } from "@tanstack/react-router";
import { tunnelSentryEnvelope } from "#/lib/sentry/tunnel";

export const Route = createFileRoute("/api/sentry")({
  server: {
    handlers: {
      POST: ({ request }) => tunnelSentryEnvelope(request),
    },
  },
});
