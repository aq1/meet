import type { WebhookEvent } from "livekit-server-sdk";
import { createRoomUser, getRoom } from "@/apps/rooms/queries";

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
