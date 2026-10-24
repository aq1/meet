import { createMiddleware } from "@tanstack/react-start";
import { sessionMiddleware } from "@/apps/auth/middleware/session-middleware";

export const anyUserMiddleware = createMiddleware({ type: "function" })
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (!context.session) {
      throw new Response("Unauthorized", { status: 401 });
    }
    return next({ context: { session: context.session, userId: Number(context.session.user.id) } });
  });
