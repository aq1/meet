import { db } from "#/lib/db/client";

export const getRoom = async (roomId: string) => {
  return await db
    .selectFrom("room")
    .innerJoin("user", "user.id", "createdBy")
    .selectAll()
    .where("publicId", "=", roomId)
    .executeTakeFirst();
};
