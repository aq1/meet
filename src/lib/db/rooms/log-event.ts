import type { WebhookEvent } from "@livekit/protocol";
import { db } from "#/lib/db/client";

type LogLivekitEventT = { eventId: string; eventName: string; roomName: string; data: WebhookEvent };

export const logLivekitEvent = async ({ eventId, eventName, roomName, data }: LogLivekitEventT) => {
  const result = await db
    .insertInto("roomEvent")
    .values({ eventId, event: eventName, roomName, data: JSON.stringify(data) })
    .onConflict((oc) => oc.column("eventId").doNothing())
    .executeTakeFirst();
  return Boolean(result.numInsertedOrUpdatedRows);
};
