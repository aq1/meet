import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/services/auth-middleware";
import { createRoom } from "@/apps/rooms/queries";

export const createRoomServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const roomId = Math.random().toString(36).slice(2, 10);
    await createRoom(roomId, Number(context.session.user.id));
    return { roomId };
  });
