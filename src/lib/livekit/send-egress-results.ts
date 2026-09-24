import { EgressStatus, type WebhookEvent } from "@livekit/protocol";
import { getRoom } from "#/lib/db/rooms/get-room";
import { updateRoom } from "#/lib/db/rooms/update-room";
import { sendEmail } from "#/lib/email/send-email";
import { presignS3Download } from "../s3/persign-download";

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

export const sendEgressResults = async (event: WebhookEvent) => {
  const info = event.egressInfo;
  if (!event.room?.name || !info) {
    return;
  }
  if (info.status !== EgressStatus.EGRESS_COMPLETE) {
    return;
  }
  const egressUrl = info.fileResults[0]?.location ?? info.segmentResults[0]?.playlistLocation ?? "";

  const egressDownloadUrl = presignS3Download(egressUrl);
  await sendEmailWithEgressUrl(info.roomName, egressDownloadUrl);

  await updateRoom(info.roomName, { egressUrl, finishedAt: new Date() });
};
