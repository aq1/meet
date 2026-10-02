import { relations } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { room } from "./room";
import { roomUser } from "./room-user";

export const roomRelations = relations(room, ({ one, many }) => ({
  creator: one(user, {
    fields: [room.createdBy],
    references: [user.id],
  }),
  roomUsers: many(roomUser),
}));
