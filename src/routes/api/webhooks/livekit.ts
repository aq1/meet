import { createFileRoute } from "@tanstack/react-router";
import { logLivekitEvent } from "#/lib/db/rooms/log-event";
import { receiveLivekitWebhook } from "#/lib/livekit/receive-livekit-webhook";
import { sendEgressResults } from "#/lib/livekit/send-egress-results";
import { startRoomRecording } from "#/lib/livekit/start-room-recording";
import { stopRoomRecording } from "#/lib/livekit/stop-room-recording";

export const Route = createFileRoute("/api/webhooks/livekit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { event, error } = await receiveLivekitWebhook(request);
        if (error) {
          console.warn("livekit webhook rejected", error.message);
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
              event.room ? await startRoomRecording(event.room.name) : null;
              break;
            case "room_finished":
              event.room ? await stopRoomRecording(event.room.name) : null;
              break;
            case "egress_ended":
              await sendEgressResults(event);
              break;
          }
        } catch (_e) {
          console.warn("Webhook action failed");
        }
        return new Response(JSON.stringify({ ok: true }));
      },
    },
  },
});
