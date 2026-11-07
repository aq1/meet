import { createMiddleware } from "@tanstack/react-start";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { RoomInputSchema } from "@/apps/rooms/shared/schemas";
import { db } from "@/lib/db/client";

export const activeRoomMiddleware = createMiddleware({ type: "function" })
  .middleware([anyUserMiddleware])
  .validator(RoomInputSchema)
  .server(async ({ next, data }) => {
    const room = await db.query.room.findFirst({
      where: {
        publicId: data.roomId,
        finishedAt: { isNull: true },
      },
    });

    if (!room) {
      throw new Response("Room not found", { status: 404 });
    }

    return next({ context: { room } });
  });
