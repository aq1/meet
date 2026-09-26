import { db } from "../client";

export const createRoomUser = async (roomId: number, userId: number) => {
  return await db.insertInto("roomUser").values({ roomId, userId }).execute();
};
