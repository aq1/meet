import type { Updateable } from "kysely";
import { db } from "#/lib/db/client";
import type { Room } from "#/lib/db/schema";

export const updateRoom = async (roomId: string, fields: Updateable<Room>) => {
  await db.updateTable("room").where("publicId", "=", roomId).set(fields).execute();
};
