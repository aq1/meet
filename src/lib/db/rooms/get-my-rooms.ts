import { jsonArrayFrom } from "kysely/helpers/postgres";
import { db } from "@/lib/db/client";

export const getMyRooms = async (userId: number, offset: number, limit: number) => {
  return await db
    .selectFrom("room")
    .select((eb) => [
      "room.id",
      "room.publicId",
      "room.createdAt",
      "room.createdBy",
      "room.finishedAt",
      "room.egressUrl",
      jsonArrayFrom(
        eb
          .selectFrom("roomUser")
          .innerJoin("user", "user.id", "roomUser.userId")
          .select(["user.id", "user.name", "user.image"])
          .whereRef("roomUser.roomId", "=", "room.id"),
      ).as("users"),
    ])
    .where("room.createdBy", "=", userId)
    .orderBy("room.createdAt", "desc")
    .limit(limit)
    .offset(offset)
    .execute();
};
