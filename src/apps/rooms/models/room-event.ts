import { integer, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const roomEvent = pgTable("rooms_room_event", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  event: varchar("event", { length: 255 }),
  roomName: varchar("room_name", { length: 255 }),
  eventId: varchar("event_id", { length: 255 }).notNull().unique(),
  data: jsonb("data"),
});
