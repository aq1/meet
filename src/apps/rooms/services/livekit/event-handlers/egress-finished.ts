import { eq } from "drizzle-orm";
import { EgressStatus, type WebhookEvent } from "livekit-server-sdk";
import { user } from "@/apps/auth/models/user";
import { sendEmail } from "@/apps/notifications/services/send-email";
import { room } from "@/apps/rooms/models/room";
import { presignS3Download } from "@/apps/storage/services/presign-download";
import { db } from "@/lib/db/client";

const sendEmailWithEgressUrl = async (roomId: string, url: string) => {
  if (!url) {
    return;
  }
  const [owner] = await db
    .select({ name: user.name, email: user.email })
    .from(room)
    .innerJoin(user, eq(user.id, room.createdBy))
    .where(eq(room.publicId, roomId))
    .limit(1);
  if (!owner?.email) {
    return;
  }
  const greeting = owner.name ? `Hi ${owner.name},` : "Hi,";
  await sendEmail({
    to: owner.email,
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

  await db
    .update(room)
    .set({ egressUrl: egressDownloadUrl, finishedAt: new Date() })
    .where(eq(room.publicId, info.roomName));
};
