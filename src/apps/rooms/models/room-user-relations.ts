import { defineRelationsPart } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { room } from "./room";
import { roomUser } from "./room-user";

export const roomUserRelations = defineRelationsPart({ roomUser, room, user }, (r) => ({
  roomUser: {
    room: r.one.room({ from: r.roomUser.roomId, to: r.room.id, optional: false }),
    user: r.one.user({ from: r.roomUser.userId, to: r.user.id, optional: false }),
  },
}));
