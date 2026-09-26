import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";
import { logLivekitEvent } from "#/lib/db/rooms/log-event";
import { receiveLivekitWebhook } from "#/lib/livekit/receive-livekit-webhook";
import { roomStartedEventHandler } from "#/lib/livekit/event-handlers/room-started";
import { roomFinishedHandler as roomFinishedEventHandler } from "#/lib/livekit/event-handlers/room-finished";
import { egressFinishedEventHandler } from "#/lib/livekit/event-handlers/egress-finished";

export const Route = createFileRoute("/api/webhooks/livekit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { event, error } = await receiveLivekitWebhook(request);
        if (error) {
          Sentry.logger.warn("livekit webhook rejected", { error: error.message });
          return new Response(JSON.stringify({ error: "invalid webhook" }), {
            status: 401,
          });
        }

        if (event.room?.name.startsWith("test-")) {
          return new Response(JSON.stringify({ ok: true }));
        }

        const roomId = event.room?.sid;
        if (!roomId) {
          return;
        }

        await logLivekitEvent({ eventName: event.event, roomId, data: event });

        try {
          switch (event.event) {
            case "room_started":
              event.room ? await roomStartedEventHandler(event.room.name) : null;
              break;
            case "room_finished":
              event.room ? await roomFinishedEventHandler(event.room.name) : null;
              break;
            case "egress_ended":
              await egressFinishedEventHandler(event);
              break;
          }
        } catch (e) {
          Sentry.logger.warn("livekit webhook action failed", {
            event: event.event,
            roomId,
            error: e instanceof Error ? e.message : String(e),
          });
        }
        return new Response(JSON.stringify({ ok: true }));
      },
    },
  },
});
