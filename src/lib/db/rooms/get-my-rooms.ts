import { db } from "#/lib/db/client";

export const getMyRooms = async (userId: number, offset: number, limit: number) => {
  return await db
    .selectFrom("room")
    .selectAll()
    .where("createdBy", "=", userId)
    .limit(limit)
    .orderBy("createdAt", "desc")
    .offset(offset)
    .execute();
};
