import { createMiddleware } from "@tanstack/react-start";
import { sessionMiddleware } from "@/lib/auth/session-middleware";

export const anyUserMiddleware = createMiddleware({ type: "function" })
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (!context.session) {
      throw new Response("Unauthorized", { status: 401 });
    }
    return next({ context: { session: context.session } });
  });
