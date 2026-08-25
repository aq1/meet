import { createFileRoute } from "@tanstack/react-router";
import { receiveLivekitWebhook } from "#/lib/livekit";

export const Route = createFileRoute("/api/webhooks/livekit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { event, error } = await receiveLivekitWebhook(request);
        if (error) {
          console.warn("livekit webhook rejected", error.message);
          return new Response(JSON.stringify({ error: "invalid webhook" },), { status: 401 });
        }

        switch (event.event) {
          case "room_started":
          case "room_finished":
            console.log(event.event, event.room?.name);
            break;
          case "participant_joined":
          case "participant_left":
            console.log(
              event.event,
              event.room?.name,
              event.participant?.identity,
            );
            break;
          default:
            console.log(event.event);
        }

        return new Response(JSON.stringify({ ok: true }));
      },
    },
  },
});
