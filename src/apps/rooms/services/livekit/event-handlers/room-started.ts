import { eq } from "drizzle-orm";
import { EncodedFileOutput, EncodedFileType, type WebhookEvent } from "livekit-server-sdk";
import { room } from "@/apps/rooms/models";
import { egressClient } from "@/apps/rooms/services/livekit/egress-client";
import { env } from "@/env";
import { db } from "@/lib/db/client";

export const roomStartedEventHandler = async (event: WebhookEvent) => {
  if (!event.room) {
    return;
  }

  if (!env.EGRESS_TEMPLATE_URL) {
    throw new Error("EGRESS_TEMPLATE_URL is not configured");
  }

  const r = await db
    .update(room)
    .set({ startedAt: new Date(Number(event.room.creationTimeMs)) })
    .where(eq(room.publicId, event.room.name))
    .returning();

  if (!r.length) {
    return;
  }

  const prefix = "{room_name}/recording";

  await egressClient.startRoomCompositeEgress(
    event.room.name,
    {
      file: new EncodedFileOutput({
        fileType: EncodedFileType.MP4,
        filepath: `${prefix}/{time}.mp4`,
      }),
    },
    {
      customBaseUrl: env.EGRESS_TEMPLATE_URL,
    },
  );
};
