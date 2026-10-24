import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { room } from "@/apps/rooms/models/room";
import { db } from "@/lib/db/client";

export const createRoomServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const roomId = Math.random().toString(36).slice(2, 10);
    await db.insert(room).values({ publicId: roomId, createdBy: context.userId });
    return { roomId };
  });
