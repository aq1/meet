import { createMiddleware } from "@tanstack/react-start";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { RoomInputSchema } from "@/apps/rooms/shared/schemas";
import { db } from "@/lib/db/client";

export const activeRoomParticipantMiddleware = createMiddleware({ type: "function" })
  .middleware([anyUserMiddleware])
  .validator(RoomInputSchema)
  .server(async ({ next, data, context }) => {
    const room = await db.query.room.findFirst({
      where: {
        publicId: data.roomId,
        finishedAt: { isNull: true },
        roomUsers: { userId: context.userId },
      },
    });

    if (!room) {
      throw new Response("Room not found", { status: 404 });
    }

    return next({ context: { room } });
  });
