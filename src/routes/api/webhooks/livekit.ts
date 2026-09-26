import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";
import { logLivekitEvent } from "#/lib/db/rooms/log-event";
import { egressFinishedEventHandler } from "#/lib/livekit/event-handlers/egress-finished";
import { participantJoinedEventHandler } from "#/lib/livekit/event-handlers/participant-joined";
import { roomFinishedEventHandler } from "#/lib/livekit/event-handlers/room-finished";
import { roomStartedEventHandler } from "#/lib/livekit/event-handlers/room-started";
import { receiveLivekitWebhook } from "#/lib/livekit/receive-livekit-webhook";

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

        const roomName = event.room?.name;
        if (!roomName) {
          return;
        }

        const isNewEvent = await logLivekitEvent({ eventId: event.id, eventName: event.event, roomName, data: event });
        if (!isNewEvent) {
          return new Response(JSON.stringify({ ok: true }));
        }

        try {
          switch (event.event) {
            case "participant_joined":
              await participantJoinedEventHandler(event);
              break;
            case "participant_left":
              break;
            case "room_started":
              await roomStartedEventHandler(event);
              break;
            case "room_finished":
              await roomFinishedEventHandler(event);
              break;
            case "egress_ended":
              await egressFinishedEventHandler(event);
              break;
          }
        } catch (e) {
          Sentry.logger.warn("livekit webhook action failed", {
            event: event.event,
            roomName,
            error: e instanceof Error ? e.message : String(e),
          });
        }
        return new Response(JSON.stringify({ ok: true }));
      },
    },
  },
});
