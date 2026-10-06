import { eq } from "drizzle-orm";
import type { WebhookEvent } from "livekit-server-sdk";
import { room } from "@/apps/rooms/models/room";
import { egressClient } from "@/apps/rooms/services/livekit/egress-client";
import { db } from "@/lib/db/client";

export const roomFinishedEventHandler = async (event: WebhookEvent) => {
  if (!event.room?.name) {
    return;
  }

  await db.update(room).set({ finishedAt: new Date() }).where(eq(room.publicId, event.room.name));
  const active = await egressClient.listEgress({ roomName: event.room.name, active: true });
  return await Promise.all(active.map((info) => egressClient.stopEgress(info.egressId)));
};
