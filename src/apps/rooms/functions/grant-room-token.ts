import { createServerFn } from "@tanstack/react-start";
import { anyUserMiddleware } from "@/apps/auth/services/any-user-middleware";
import { auth } from "@/apps/auth/services/server";
import { roomIsActive } from "@/apps/rooms/queries";
import { grantLivekitToken } from "@/apps/rooms/services/livekit/grant-livekit-token";

export const grantRoomTokenServerFn = createServerFn({ method: "POST" })
  .middleware([anyUserMiddleware])
  .validator((data: { username: string; roomId: string }) => data)
  .handler(async ({ data, context }) => {
    if (!(await roomIsActive(data.roomId))) {
      throw new Response("Room not found", { status: 404 });
    }
    const { user } = context.session;
    if (user.isAnonymous && user.name !== data.username) {
      const ctx = await auth.$context;
      await ctx.internalAdapter.updateUser(user.id, { name: data.username });
    }
    return await grantLivekitToken(user.id.toString(), data.username, data.roomId);
  });
