import { jsonb, snakeCase, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";

export const roomEvent = snakeCase.table("rooms_room_event", {
  ...baseColumns,
  event: varchar({ length: 255 }),
  roomName: varchar({ length: 255 }),
  eventId: varchar({ length: 255 }).notNull().unique(),
  data: jsonb(),
});
