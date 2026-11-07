import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";

export const createRoomServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    const roomId = Math.random().toString(36).slice(2, 10);
    throw redirect({ to: "/room/$roomId", params: { roomId } });
  });
