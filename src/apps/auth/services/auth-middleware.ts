import { createMiddleware } from "@tanstack/react-start";
import { sessionMiddleware } from "@/apps/auth/services/session-middleware";

export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (!context.session || context.session.user.isAnonymous) {
      throw new Response("Unauthorized", { status: 401 });
    }
    return next({ context: { session: context.session } });
  });
