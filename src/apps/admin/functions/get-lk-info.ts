import { createServerFn } from "@tanstack/react-start";
import { roomServiceClient } from "@/apps/rooms/services/livekit/room-service-client";
import { adminMiddleware } from "../middleware/admin-middleware";

type RoomT = {
  sid: string;
  name: string;
  creationTime: Date;
  participants: Array<{
    identity: string;
    name: string;
    state: string;
    kind: string;
  }>;
};

const participantStates: Record<number, string> = {
  0: "joining",
  1: "joined",
  2: "active",
  3: "disconnected",
};

const participantKinds: Record<number, string> = {
  0: "standard",
  1: "ingress",
  2: "egress",
  3: "sip",
  4: "agent",
  7: "connector",
  8: "bridge",
};

export const getLkInfoFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .handler(async () => {
    const rooms: Array<RoomT> = [];
    const lkRooms = await roomServiceClient.listRooms();
    lkRooms.sort((a, b) => Number(b.creationTime - a.creationTime));
    for (const r of lkRooms) {
      const participants = await roomServiceClient.listParticipants(r.name);
      rooms.push({
        sid: r.sid,
        name: r.name,
        creationTime: new Date(Number(r.creationTimeMs)),
        participants: participants.map((p) => ({
          identity: p.identity,
          name: p.name,
          state: participantStates[p.state] ?? `unknown (${p.state})`,
          kind: participantKinds[p.kind] ?? `unknown (${p.kind})`,
        })),
      });
    }
    return { rooms };
  });
