import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "@/lib/auth/ensure-session";
import { getMyRooms } from "@/lib/db/rooms/get-my-rooms";

export const listMyRoomsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await ensureSession();
  return getMyRooms(Number(session.user.id), 0, 100);
});
