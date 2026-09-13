import type { Updateable } from "kysely";
import { db } from "#/lib/db";
import type { Room } from "#/lib/db/schema";

export const roomExists = async (roomId: string) => {
  const row = await db
    .selectFrom("room")
    .select("id")
    .where("publicId", "=", roomId)
    .executeTakeFirst();
  return Boolean(row);
};

export const updateRoom = async (roomId: string, fields: Updateable<Room>) => {
  await db
    .updateTable("room")
    .where("publicId", "=", roomId)
    .set(fields)
    .execute();
};
