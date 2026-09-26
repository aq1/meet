import type { WebhookEvent } from "livekit-server-sdk";
import { createRoomUser } from "#/lib/db/rooms/create-room-user";
import { getRoom } from "#/lib/db/rooms/get-room";

export const participantJoinedEventHandler = async (event: WebhookEvent) => {
  if (!(event.room && event.participant)) {
    return;
  }

  const room = await getRoom(event.room.name);
  if (!room) {
    return;
  }

  await createRoomUser(Number(event.participant.identity), Number(room.id));
};
