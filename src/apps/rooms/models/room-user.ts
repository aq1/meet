import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { room } from "./room";

export const roomUser = pgTable("rooms_room_user", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id")
    .notNull()
    .references(() => room.id),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
});
