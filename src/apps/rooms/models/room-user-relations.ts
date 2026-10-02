import { relations } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { room } from "./room";
import { roomUser } from "./room-user";

export const roomUserRelations = relations(roomUser, ({ one }) => ({
  room: one(room, {
    fields: [roomUser.roomId],
    references: [room.id],
  }),
  user: one(user, {
    fields: [roomUser.userId],
    references: [user.id],
  }),
}));
