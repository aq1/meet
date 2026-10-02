import { integer, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import type { WebhookEvent } from "livekit-server-sdk";
import { db } from "@/lib/db/client";

export const roomEvent = pgTable("rooms_room_event", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  event: varchar("event", { length: 255 }),
  roomName: varchar("room_name", { length: 255 }),
  eventId: varchar("event_id", { length: 255 }).notNull().unique(),
  data: jsonb("data"),
});

type LogLivekitEventT = { eventId: string; eventName: string; roomName: string; data: WebhookEvent };

export const logLivekitEvent = async ({ eventId, eventName, roomName, data }: LogLivekitEventT) => {
  const rows = await db
    .insert(roomEvent)
    .values({ eventId, event: eventName, roomName, data })
    .onConflictDoNothing({ target: roomEvent.eventId })
    .returning({ id: roomEvent.id });
  return rows.length > 0;
};
