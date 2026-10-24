import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/apps/auth/services/server";
import { randomUserColor } from "@/apps/auth/utils/colors";
import { grantLivekitToken } from "@/apps/rooms/services/livekit/grant-livekit-token";
import { db } from "@/lib/db/client";
import { activeRoomMiddleware } from "../middleware/active-room-middleware";
import { roomUser } from "../models";

export const grantRoomTokenServerFn = createServerFn({ method: "POST" })
  .middleware([activeRoomMiddleware])
  .validator((data: { username: string }) => data)
  .handler(async ({ data, context }) => {
    const { user } = context.session;

    await db.insert(roomUser).values({ roomId: context.room.id, userId: context.userId }).onConflictDoNothing();

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
    return await grantLivekitToken(context.userId.toString(), data.username, context.room.publicId);
  });
