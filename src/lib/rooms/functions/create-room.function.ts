import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/auth-middleware";
import { createRoom } from "@/lib/db/rooms/create-room";

export const createRoomServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const id = Math.random().toString(36).slice(2, 10);
    const roomId = import.meta.env.PROD ? id : `test-${id}`;
    await createRoom(roomId, Number(context.session.user.id));
    return { roomId };
  });
