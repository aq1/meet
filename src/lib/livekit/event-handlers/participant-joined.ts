import type { WebhookEvent } from "livekit-server-sdk";
import { getRoom } from "#/lib/db/rooms/get-room";

export const participantJoinedEventHandler = async (event: WebhookEvent) => {
  if (!(event.room?.name && event.participant?.identity)) {
    return;
  }

  const room = await getRoom(event.room.name);
  if (!room) {
    return;
  }

  // await createParticipant(room.id)
};
