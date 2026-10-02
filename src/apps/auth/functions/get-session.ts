import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { publicMiddleware } from "@/apps/auth/services/public-middleware";
import { auth } from "@/apps/auth/services/server";

export const getSession = createServerFn({ method: "GET" })
  .middleware([publicMiddleware])
  .handler(async () => await auth.api.getSession({ headers: getRequestHeaders() }));
