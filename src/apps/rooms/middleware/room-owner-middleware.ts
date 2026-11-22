import { createMiddleware } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { db } from "@/lib/db/client";

const RoomOwnerInputSchema = z.object({ roomId: z.string().min(1).max(64) });

export const roomOwnerMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .validator(RoomOwnerInputSchema)
  .server(async ({ next, data, context }) => {
    const room = await db.query.room.findFirst({
      where: {
        publicId: data.roomId,
        createdBy: context.userId,
      },
    });

    if (!room) {
      throw new Response("Room not found", { status: 404 });
    }

    return next({ context: { room } });
  });
