import { db } from "#/lib/db";

export const roomExists = async (roomId: string) => {
  const row = await db
    .selectFrom("room")
    .select("id")
    .where("id", "=", roomId)
    .executeTakeFirst();
  return Boolean(row);
};
