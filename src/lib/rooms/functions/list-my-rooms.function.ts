import { createServerFn } from "@tanstack/react-start";
import { listMyRooms } from "@/apps/rooms/queries";
import { authMiddleware } from "@/lib/auth/auth-middleware";

export const listMyRoomsServerFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listMyRooms(Number(context.session.user.id), 0, 100));
