import { db } from "../client";

export const createRoomUser = async (userId: number, roomId: number) => {
  return await db.insertInto("roomUser").values({ roomId, userId }).execute();
};
