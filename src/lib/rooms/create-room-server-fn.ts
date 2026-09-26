import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth/server";
import { createRoom } from "#/lib/db/rooms/create-room";

export const createRoomServerFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() });
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const id = Math.random().toString(36).slice(2, 10);
  const roomId = import.meta.env.PROD ? id : `test-${id}`;
  await createRoom(roomId, Number(session.user.id));
  return { roomId };
});
