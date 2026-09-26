import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "../auth/ensure-session";
import { getMyRooms } from "../db/rooms/get-my-rooms";

export const listMyRoomsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await ensureSession();
  return getMyRooms(Number(session.user.id), 0, 100);
});
