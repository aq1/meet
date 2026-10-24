import { createMiddleware } from "@tanstack/react-start";
import { anyUserMiddleware } from "./any-user-middleware";

export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([anyUserMiddleware])
  .server(async ({ next, context }) => {
    if (context.session.user.isAnonymous) {
      throw new Response("Unauthorized", { status: 401 });
    }
    return next({ context: { session: context.session, userId: context.userId } });
  });
