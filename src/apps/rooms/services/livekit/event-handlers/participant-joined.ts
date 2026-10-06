import { eq } from "drizzle-orm";
import type { WebhookEvent } from "livekit-server-sdk";
import { room } from "@/apps/rooms/models/room";
import { roomUser } from "@/apps/rooms/models/room-user";
import { db } from "@/lib/db/client";

export const participantJoinedEventHandler = async (event: WebhookEvent) => {
  if (!(event.room && event.participant)) {
    return;
  }

  const [joinedRoom] = await db.select({ id: room.id }).from(room).where(eq(room.publicId, event.room.name)).limit(1);
  if (!joinedRoom) {
    return;
  }

  await db.insert(roomUser).values({ roomId: joinedRoom.id, userId: Number(event.participant.identity) });
};
