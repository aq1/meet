import type { WebhookEvent } from "livekit-server-sdk";
import { updateRoom } from "#/lib/db/rooms/update-room";
import { egressClient } from "#/lib/livekit/egress-client";

export const roomFinishedEventHandler = async (event: WebhookEvent) => {
  if (!event.room?.name) {
    return;
  }

  await updateRoom(event.room.name, { finishedAt: new Date() });
  const active = await egressClient.listEgress({ roomName: event.room.name, active: true });
  return await Promise.all(active.map((info) => egressClient.stopEgress(info.egressId)));
};
