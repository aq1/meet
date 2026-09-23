import { egressClient } from "#/lib/livekit/egress-client";

export const stopRoomRecording = async (roomName: string) => {
  const active = await egressClient.listEgress({ roomName, active: true });
  return await Promise.all(active.map((info) => egressClient.stopEgress(info.egressId)));
};
