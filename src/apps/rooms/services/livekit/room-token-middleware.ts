import { createMiddleware } from "@tanstack/react-start";
import { verifyLivekitRoomToken } from "@/apps/rooms/services/livekit/verify-livekit-room-token";

export const roomTokenMiddleware = createMiddleware({ type: "function" })
  .validator((data: { roomId: string; token: string }) => data)
  .server(async ({ next, data }) => {
    const roomTokenClaims = await verifyLivekitRoomToken(data.token, data.roomId);
    if (!roomTokenClaims) {
      throw new Response("Forbidden", { status: 403 });
    }
    return next({ context: { roomTokenClaims } });
  });
