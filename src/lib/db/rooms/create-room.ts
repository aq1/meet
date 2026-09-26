import { db } from "#/lib/db/client";

export const createRoom = async (roomId: string, createdBy: number) => {
  await db.insertInto("room").values({ publicId: roomId, createdBy }).execute();
};
