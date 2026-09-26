import { updateRoom } from "#/lib/db/rooms/update-room";
import { egressClient } from "#/lib/livekit/egress-client";

export const roomFinishedHandler = async (roomName: string) => {
  await updateRoom(roomName, { finishedAt: new Date() });
  const active = await egressClient.listEgress({ roomName, active: true });
  return await Promise.all(active.map((info) => egressClient.stopEgress(info.egressId)));
};
