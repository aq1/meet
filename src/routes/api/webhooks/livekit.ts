import { createFileRoute } from "@tanstack/react-router";
import { handleLivekitWebhook } from "#/lib/livekit/handle-livekit-webhook";

export const Route = createFileRoute("/api/webhooks/livekit")({
  server: {
    handlers: {
      POST: ({ request }) => handleLivekitWebhook(request),
    },
  },
});
