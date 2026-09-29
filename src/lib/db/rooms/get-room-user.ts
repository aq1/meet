import { db } from "../client";

export const getRoomUser = async (roomName: string, userId: number) => {
  return await db
    .selectFrom("roomUser")
    .innerJoin("room", "roomId", "room.id")
    .select(["roomId", "createdAt"])
    .where("publicId", "=", roomName)
    .where("userId", "=", userId)
    .executeTakeFirst();
};
