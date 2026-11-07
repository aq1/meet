import { createMiddleware } from "@tanstack/react-start";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { RoomInputSchema } from "@/apps/rooms/shared/schemas";
import { db } from "@/lib/db/client";
import { room } from "../models";

export const activeRoomMiddleware = createMiddleware({ type: "function" })
  .middleware([anyUserMiddleware])
  .validator(RoomInputSchema)
  .server(async ({ next, data, context }) => {
    let dbRoom = await db.query.room.findFirst({
      where: {
        publicId: data.roomId,
        finishedAt: { isNull: true },
      },
    });

    if (!dbRoom) {
      if (context.session.user.isAnonymous) {
        throw new Response("Room not found", { status: 404 });
      }
      [dbRoom] = await db.insert(room).values({ publicId: data.roomId, createdBy: context.userId }).returning();
    }

    return next({ context: { room: dbRoom } });
  });
