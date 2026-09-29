import { createServerFn } from "@tanstack/react-start";
import { getSession } from "#/lib/auth/functions/get-session.function";
import { db } from "#/lib/db/client";
import { roomExists } from "#/lib/db/rooms/room-exists";
import { grantLivekitToken } from "#/lib/livekit/grant-livekit-token";

const __tempEnsureUser = async (name: string) => {
  const session = await getSession();
  if (session) {
    return session.user.id;
  }
  const result = await db
    .insertInto("user")
    .values({ email: `temp${crypto.randomUUID()}@snek.sh`, emailVerified: true, name })
    .returning("id")
    .executeTakeFirstOrThrow();

  return result.id.toString();
};

export const grantRoomTokenServerFn = createServerFn({ method: "POST" })
  .validator((data: { username: string; roomId: string }) => data)
  .handler(async ({ data }) => {
    if (!(await roomExists(data.roomId))) {
      throw new Response("Room not found", { status: 404 });
    }
    const identity = await __tempEnsureUser(data.username);
    return await grantLivekitToken(identity, data.username, data.roomId);
  });
