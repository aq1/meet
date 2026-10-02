import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { publicMiddleware } from "@/lib/auth/public-middleware";
import { auth } from "@/lib/auth/server";

export const getSession = createServerFn({ method: "GET" })
  .middleware([publicMiddleware])
  .handler(async () => await auth.api.getSession({ headers: getRequestHeaders() }));
