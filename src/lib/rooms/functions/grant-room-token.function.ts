import { createServerFn } from "@tanstack/react-start";
import { createTempUser } from "@/apps/auth/queries";
import { roomExists } from "@/apps/rooms/queries";
import { sessionMiddleware } from "@/lib/auth/session-middleware";
import { grantLivekitToken } from "@/lib/livekit/grant-livekit-token";

const __tempCreateUser = async (name: string) => {
  const result = await createTempUser(name);
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
