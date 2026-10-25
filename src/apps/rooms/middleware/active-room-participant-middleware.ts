import { createMiddleware } from "@tanstack/react-start";
import { sessionMiddleware } from "@/apps/auth/middleware/session-middleware";
import { RoomInputSchema } from "@/apps/rooms/shared/schemas";
import { db } from "@/lib/db/client";
import { verifyLivekitRoomToken } from "../services/livekit/verify-livekit-room-token";

export const activeRoomParticipantMiddleware = createMiddleware({ type: "function" })
  .middleware([sessionMiddleware])
  .validator(RoomInputSchema)
  .server(async ({ next, data, context }) => {
    if (data.token) {
      const claim = await verifyLivekitRoomToken(data.token, data.roomId);
      if (!claim) {
        throw new Response("Not allowed", { status: 401 });
      }
      const room = await db.query.room.findFirst({ where: { publicId: data.roomId } });
      if (!room) {
        throw new Response("Room not found", { status: 404 });
      }
      return next({ context: { room } });
    }

    if (!context.session?.user) {
      throw new Response("Not allowed", { status: 401 });
    }

    const room = await db.query.room.findFirst({
      where: {
        publicId: data.roomId,
        finishedAt: { isNull: true },
        roomUsers: { userId: Number(context.session.user.id) },
      },
    });

    if (!room) {
      throw new Response("Room not found", { status: 404 });
    }

    return next({ context: { room } });
  });
