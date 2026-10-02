import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/services/auth-middleware";
import { listMyRooms } from "@/apps/rooms/queries";

export const listMyRoomsServerFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listMyRooms(Number(context.session.user.id), 0, 100));
