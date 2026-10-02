import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/services/auth-middleware";

export const throwServerErrorServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    throw new Error("Sentry test: server error");
  });
