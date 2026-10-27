import { eq } from "drizzle-orm";
import { EgressStatus, type WebhookEvent } from "livekit-server-sdk";
import { sendEmail } from "@/apps/notifications/services/send-email";
import { room } from "@/apps/rooms/models/room";
import { presignS3Download } from "@/apps/storage/services/presign-download";
import { db } from "@/lib/db/client";
import { m } from "@/paraglide/messages";

const sendEmailWithEgressUrl = async (roomId: string, url: string) => {
  if (!url) {
    return;
  }
  const ownedRoom = await db.query.room.findFirst({
    columns: {},
    where: { publicId: roomId },
    with: { creator: { columns: { name: true, email: true, lang: true } } },
  });
  const owner = ownedRoom?.creator;
  if (!owner?.email) {
    return;
  }
  const locale = owner.lang;
  const greeting = owner.name
    ? m.recording_email_greeting_named({ name: owner.name }, { locale })
    : m.recording_email_greeting({}, { locale });
  const htmlGreeting = owner.name
    ? m.recording_email_greeting_named({ name: Bun.escapeHTML(owner.name) }, { locale })
    : m.recording_email_greeting({}, { locale });
  const ready = m.recording_email_ready({ roomId }, { locale });
  const htmlReady = m.recording_email_ready({ roomId: Bun.escapeHTML(roomId) }, { locale });
  const download = m.recording_email_download({}, { locale });
  const htmlUrl = Bun.escapeHTML(url);
  await sendEmail({
    to: owner.email,
    subject: m.recording_email_subject({}, { locale }),
    html: `<p>${htmlGreeting}</p><p>${htmlReady}</p><p>${download}<br><a href="${htmlUrl}">${htmlUrl}</a></p>`,
    text: `${greeting}\n\n${ready}\n\n${download}\n${url}`,
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
