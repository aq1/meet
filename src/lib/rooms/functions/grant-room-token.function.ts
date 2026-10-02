import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { roomExists } from "@/apps/rooms/queries";
import { auth } from "@/lib/auth/server";
import { sessionMiddleware } from "@/lib/auth/session-middleware";
import { grantLivekitToken } from "@/lib/livekit/grant-livekit-token";

const signInAnonymous = async (name: string) => {
  const { user } = await auth.api.signInAnonymous({ headers: getRequestHeaders() });
  const ctx = await auth.$context;
  await ctx.internalAdapter.updateUser(user.id, { name });
  return user;
};

export const grantRoomTokenServerFn = createServerFn({ method: "POST" })
  .middleware([sessionMiddleware])
  .validator((data: { username: string; roomId: string }) => data)
  .handler(async ({ data, context }) => {
    if (!(await roomExists(data.roomId))) {
      throw new Response("Room not found", { status: 404 });
    }
    const user = context.session?.user ?? (await signInAnonymous(data.username));
    return await grantLivekitToken(user.id.toString(), data.username, data.roomId);
  });
