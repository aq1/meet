import { createMiddleware } from "@tanstack/react-start";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { ROOM_NOT_FOUND_ERROR } from "@/apps/rooms/shared/errors";
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
      throw new Error(ROOM_NOT_FOUND_ERROR);
    }

    return next({ context: { room } });
  });
