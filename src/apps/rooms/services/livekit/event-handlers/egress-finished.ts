import { EgressStatus, type WebhookEvent } from "livekit-server-sdk";
import { sendEmail } from "@/apps/notifications/services/send-email";
import { getRoom, updateRoom } from "@/apps/rooms/queries";
import { presignS3Download } from "@/apps/storage/services/presign-download";

const sendEmailWithEgressUrl = async (roomId: string, url: string) => {
  if (!url) {
    return;
  }
  const room = await getRoom(roomId);
  if (!room?.email) {
    return;
  }
  const greeting = room.username ? `Hi ${room.username},` : "Hi,";
  await sendEmail({
    to: room.email,
    subject: "Your call recording is here",
    html: `<p>${greeting}</p><p>The recording of your call ${roomId} is ready.</p><p>Download it here (link expires in 7 days):<br><a href="${url}">${url}</a></p>`,
    text: `${greeting}\n\nThe recording of your call ${roomId} is ready.\n\nDownload it here (link expires in 7 days):\n${url}`,
    idempotencyKey: `egress-finished/${roomId}`,
  });
};

export const egressFinishedEventHandler = async (event: WebhookEvent) => {
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

  await updateRoom(info.roomName, { egressUrl: egressDownloadUrl, finishedAt: new Date() });
};
