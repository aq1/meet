import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { db } from "@/lib/db/client";
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

export const createRoomUser = async (roomId: number, userId: number) => {
  return await db.insert(roomUser).values({ roomId, userId });
};
