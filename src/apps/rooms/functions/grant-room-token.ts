import { createServerFn } from "@tanstack/react-start";
import { and, eq, isNull } from "drizzle-orm";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { auth } from "@/apps/auth/services/server";
import { randomUserColor } from "@/apps/auth/utils/colors";
import { room } from "@/apps/rooms/models/room";
import { grantLivekitToken } from "@/apps/rooms/services/livekit/grant-livekit-token";
import { db } from "@/lib/db/client";

export const grantRoomTokenServerFn = createServerFn({ method: "POST" })
  .middleware([anyUserMiddleware])
  .validator((data: { username: string; roomId: string }) => data)
  .handler(async ({ data, context }) => {
    const [activeRoom] = await db
      .select({ id: room.id })
      .from(room)
      .where(and(eq(room.publicId, data.roomId), isNull(room.finishedAt)))
      .limit(1);
    if (!activeRoom) {
      throw new Response("Room not found", { status: 404 });
    }
    const { user } = context.session;
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
    return await grantLivekitToken(user.id.toString(), data.username, data.roomId);
  });
