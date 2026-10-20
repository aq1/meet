import { defineRelationsPart } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { room } from "./room";
import { roomUser } from "./room-user";

export const roomRelations = defineRelationsPart({ room, roomUser, user }, (r) => ({
  room: {
    creator: r.one.user({ from: r.room.createdBy, to: r.user.id, optional: false }),
    roomUsers: r.many.roomUser({ from: r.room.id, to: r.roomUser.roomId }),
  },
}));
