import { createServerFn } from "@tanstack/react-start";
import { sessionMiddleware } from "@/lib/auth/session-middleware";
import { db } from "@/lib/db/client";
import { roomExists } from "@/lib/db/rooms/room-exists";
import { grantLivekitToken } from "@/lib/livekit/grant-livekit-token";

const __tempCreateUser = async (name: string) => {
  const result = await db
    .insertInto("user")
    .values({ email: `temp${crypto.randomUUID()}@snek.sh`, emailVerified: true, name })
    .returning("id")
    .executeTakeFirstOrThrow();

  return result.id.toString();
};

export const grantRoomTokenServerFn = createServerFn({ method: "POST" })
  .middleware([sessionMiddleware])
  .validator((data: { username: string; roomId: string }) => data)
  .handler(async ({ data, context }) => {
    if (!(await roomExists(data.roomId))) {
      throw new Response("Room not found", { status: 404 });
    }
    const identity = context.session?.user.id ?? (await __tempCreateUser(data.username));
    return await grantLivekitToken(identity, data.username, data.roomId);
  });
