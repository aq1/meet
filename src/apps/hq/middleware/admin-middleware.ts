import { createMiddleware } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";

export const adminMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.session.user.role !== "admin") {
      throw new Response("Unauthorized", { status: 401 });
    }
    return next({ context: { session: context.session, userId: context.userId } });
  });
