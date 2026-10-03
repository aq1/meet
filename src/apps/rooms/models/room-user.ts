import { integer, pgTable } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { baseColumns } from "@/lib/db/columns";
import { room } from "./room";

export const roomUser = pgTable("rooms_room_user", {
  ...baseColumns,
  roomId: integer("room_id")
    .notNull()
    .references(() => room.id),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
});
