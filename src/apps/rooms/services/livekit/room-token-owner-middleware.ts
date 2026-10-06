import { createMiddleware } from "@tanstack/react-start";
import { anyUserMiddleware } from "@/apps/auth/services/any-user-middleware";
import { roomTokenMiddleware } from "@/apps/rooms/services/livekit/room-token-middleware";

export const roomTokenOwnerMiddleware = createMiddleware({ type: "function" })
  .middleware([anyUserMiddleware, roomTokenMiddleware])
  .server(async ({ next, context }) => {
    if (context.roomTokenClaims.sub !== context.session.user.id.toString()) {
      throw new Response("Forbidden", { status: 403 });
    }
    return next();
  });
