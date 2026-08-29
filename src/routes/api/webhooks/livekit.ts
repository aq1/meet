import { createFileRoute } from "@tanstack/react-router";
import { receiveLivekitWebhook } from "#/lib/livekit";
import { notifyAdmins } from "#/lib/notifications";

export const Route = createFileRoute("/api/webhooks/livekit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { event, error } = await receiveLivekitWebhook(request);
        if (error) {
          console.warn("livekit webhook rejected", error.message);
          return new Response(JSON.stringify({ error: "invalid webhook" },), { status: 401 });
        }

        const text = `${event.room?.name ?? "untitled"} ${event.event} ${event.participant?.identity ?? ""}`

        await notifyAdmins({ text })

        return new Response(JSON.stringify({ ok: true }));
      },
    },
  },
});
