import { EgressStatus, type WebhookEvent } from "@livekit/protocol";
import { createFileRoute } from "@tanstack/react-router";
import { s3 } from "bun";
import type { WebhookEventNames } from "livekit-server-sdk";
import { env } from "#/env";
import { getRoom, updateRoom } from "#/lib/db/rooms";
import { sendEmail } from "#/lib/email";
import {
  receiveLivekitWebhook,
  startRoomRecording,
  stopRoomRecording,
} from "#/lib/livekit";
import { notifyAdmins } from "#/lib/notifications";

const ignore = async (_: WebhookEvent) => { };

const notifyOnEvent = async (event: WebhookEvent) => {
  const text = `${event.room?.name ?? "untitled"} ${event.event} ${event.participant?.identity ?? ""}`;
  await notifyAdmins({ text });
};

const EGRESS_DOWNLOAD_URL_TTL = 7 * 24 * 60 * 60;

const egressObjectKey = (location: string) => {
  const path = decodeURIComponent(new URL(location).pathname).replace(
    /^\/+/,
    "",
  );
  const bucketPrefix = `${env.S3_BUCKET}/`;
  return path.startsWith(bucketPrefix) ? path.slice(bucketPrefix.length) : path;
};

const presignEgressFile = (location: string) => {
  try {
    return s3.presign(egressObjectKey(location), {
      method: "GET",
      expiresIn: EGRESS_DOWNLOAD_URL_TTL,
    });
  } catch {
    return "";
  }
};

const sendEmailWithEgressUrl = async (roomId: string, url: string) => {
  if (!url) {
    return;
  }
  const room = await getRoom(roomId);
  if (!room?.email) {
    return;
  }
  const greeting = room.name ? `Hi ${room.name},` : "Hi,";
  await sendEmail({
    to: room.email,
    subject: "Your call recording is here",
    html: `<p>${greeting}</p><p>The recording of your call ${roomId} is ready.</p><p>Download it here (link expires in 7 days):<br><a href="${url}">${url}</a></p>`,
    text: `${greeting}\n\nThe recording of your call ${roomId} is ready.\n\nDownload it here (link expires in 7 days):\n${url}`,
    idempotencyKey: `egress-finished/${roomId}`,
  });
};

const onEgressEndedEvent = async (event: WebhookEvent) => {
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

  const egressDownloadUrl = presignEgressFile(egressUrl);
  await sendEmailWithEgressUrl(info.roomName, egressDownloadUrl);

  await updateRoom(info.roomName, { egressUrl, finishedAt: new Date() });
  await notifyAdmins({
    text: `${event.room.name} ${event.event}`,
  });
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
      return onEgressEndedEvent;
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
