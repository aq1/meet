import { jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";

export const roomEvent = pgTable("rooms_room_event", {
  ...baseColumns,
  event: varchar("event", { length: 255 }),
  roomName: varchar("room_name", { length: 255 }),
  eventId: varchar("event_id", { length: 255 }).notNull().unique(),
  data: jsonb("data"),
});
