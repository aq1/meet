import { createServerFn } from "@tanstack/react-start";
import { sessionMiddleware } from "../middleware/session-middleware";

export const getUser = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => {
    return context.session?.user;
  });
