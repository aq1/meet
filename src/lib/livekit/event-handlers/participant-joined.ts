import type { WebhookEvent } from "livekit-server-sdk";
import { getRoom } from "@/apps/rooms/models/room";
import { createRoomUser } from "@/apps/rooms/models/room-user";

export const participantJoinedEventHandler = async (event: WebhookEvent) => {
  if (!(event.room && event.participant)) {
    return;
  }

  const room = await getRoom(event.room.name);
  if (!room) {
    return;
  }

  await createRoomUser(Number(room.id), Number(event.participant.identity));
};
