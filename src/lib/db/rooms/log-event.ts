import type { WebhookEvent } from "@livekit/protocol";
import { db } from "#/lib/db/client";

type LogLivekitEventT = { eventName: string; roomId: string; data: WebhookEvent };

export const logLivekitEvent = async ({ eventName, roomId, data }: LogLivekitEventT) => {
  await db
    .insertInto("roomEvent")
    .values({ event: eventName, roomId, data: JSON.stringify(data) })
    .execute();
};
