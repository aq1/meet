import { EgressStatus, type WebhookEvent } from "@livekit/protocol";
import { createFileRoute } from "@tanstack/react-router";
import type { WebhookEventNames } from "livekit-server-sdk";
import {
  receiveLivekitWebhook,
  startRoomRecording,
  stopRoomRecording,
} from "#/lib/livekit";
import { notifyAdmins } from "#/lib/notifications";
import { updateRoom } from "#/lib/db/rooms";

const ignore = async (_: WebhookEvent) => { };

const notifyOnEvent = async (event: WebhookEvent) => {
  const text = `${event.room?.name ?? "untitled"} ${event.event} ${event.participant?.identity ?? ""}`;
  await notifyAdmins({ text });
};

const chain = (...actions: Array<(event: WebhookEvent) => Promise<void>>) => {
  return async (event: WebhookEvent) => {
    await Promise.all(actions.map((a) => a(event)));
  };
};


const updateFinishedRoom = async (event: WebhookEvent) => {
  const info = event.egressInfo;
  if (!event.room?.name || !info) {
    return;
  }
  if (info.status !== EgressStatus.EGRESS_COMPLETE) {
    return;
  }
  const egressUrl =
    info.fileResults[0]?.location ??
    info.segmentResults[0]?.playlistLocation ??
    "";
  await updateRoom(info.roomName, { egressUrl, finishedAt: new Date() });
};

const livekitEventRouter = (eventName: WebhookEventNames) => {
  switch (eventName) {
    case "room_started":
      return notifyOnEvent;
    case "room_finished":
      return notifyOnEvent;
    case "participant_joined":
      return notifyOnEvent;
    case "participant_left":
      return notifyOnEvent;
    case "egress_started":
      return notifyOnEvent;
    case "egress_ended":
      return chain(updateFinishedRoom, notifyOnEvent);
    default:
      return ignore;
  }
};

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

        const action = livekitEventRouter(event.event);
        await action(event);

        if (event.room?.name) {
          try {
            if (event.event === "room_started") {
              await startRoomRecording(event.room.name);
            } else if (event.event === "room_finished") {
              await stopRoomRecording(event.room.name);
            }
          } catch (e) {
            console.warn(`egress ${event.event} failed`, e);
          }
        }

        return new Response(JSON.stringify({ ok: true }));
      },
    },
  },
});
