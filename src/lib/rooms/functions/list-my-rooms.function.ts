import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/auth-middleware";
import { getMyRooms } from "@/lib/db/rooms/get-my-rooms";

export const listMyRoomsServerFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => getMyRooms(Number(context.session.user.id), 0, 100));
