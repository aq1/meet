import type { WebhookEvent } from "livekit-server-sdk";
import { roomUser } from "@/apps/rooms/models/room-user";
import { db } from "@/lib/db/client";

export const participantJoinedEventHandler = async (event: WebhookEvent) => {
  if (!(event.room && event.participant)) {
    return;
  }

  const joinedRoom = await db.query.room.findFirst({ columns: { id: true }, where: { publicId: event.room.name } });
  if (!joinedRoom) {
    return;
  }

  await db
    .insert(roomUser)
    .values({ roomId: joinedRoom.id, userId: Number(event.participant.identity) })
    .onConflictDoNothing();
};
