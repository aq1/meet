import { createServerFn } from "@tanstack/react-start";
import { sessionMiddleware } from "../middleware/session-middleware";

export const getSession = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => {
    return context.session;
  });
