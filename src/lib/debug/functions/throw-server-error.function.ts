import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/auth-middleware";

export const throwServerErrorServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    throw new Error("Sentry test: server error");
  });
