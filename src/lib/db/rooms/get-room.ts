import { db } from "#/lib/db/client";

export const getRoom = async (roomId: string) => {
  return await db
    .selectFrom("room")
    .innerJoin("user", "user.id", "createdBy")
    .select([
      "room.id",
      "room.createdAt",
      "room.finishedAt",
      "room.publicId",
      "user.id as user_id",
      "user.name as username",
      "user.email",
    ])
    .where("publicId", "=", roomId)
    .executeTakeFirst();
};
