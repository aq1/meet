import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { auth } from "@/apps/auth/services/server";
import { randomUserColor } from "@/apps/auth/utils/colors";
import { grantLivekitToken } from "@/apps/rooms/services/livekit/grant-livekit-token";
import { db } from "@/lib/db/client";
import { room, roomUser } from "../models";

const GrantRoomTokenSchema = z.object({ roomId: z.string().min(1), username: z.string().trim().min(1).max(64) });

export const grantRoomTokenServerFn = createServerFn({ method: "POST" })
  .middleware([anyUserMiddleware])
  .validator(GrantRoomTokenSchema)
  .handler(async ({ data, context }) => {
    const { user } = context.session;

    let dbRoom = await db.query.room.findFirst({
      where: {
        publicId: data.roomId,
      },
    });

    if (dbRoom?.finishedAt) {
      throw new Response("Room not found", { status: 404 });
    }

    if (!dbRoom) {
      if (context.session.user.isAnonymous) {
        throw new Response("Room not found", { status: 404 });
      }
      [dbRoom] = await db.insert(room).values({ publicId: data.roomId, createdBy: context.userId }).returning();
    }

    await db.insert(roomUser).values({ roomId: dbRoom.id, userId: context.userId }).onConflictDoNothing();

    const fieldsToUpdate: { name?: string; lang?: string; color?: string } = {};
    if (user.name !== data.username) {
      fieldsToUpdate.name = data.username;
    }
    if (!user.color) {
      fieldsToUpdate.color = randomUserColor();
    }
    if (!user.lang) {
      fieldsToUpdate.lang = "ru";
    }

    if (Object.keys(fieldsToUpdate).length) {
      const ctx = await auth.$context;
      await ctx.internalAdapter.updateUser(user.id, fieldsToUpdate);
    }

    const lkGrant = await grantLivekitToken(context.userId.toString(), data.username, dbRoom.publicId);
    return {
      room: { publicId: dbRoom.publicId, startedAt: dbRoom.startedAt },
      ...lkGrant,
    };
  });
