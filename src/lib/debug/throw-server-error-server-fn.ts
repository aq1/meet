import { createServerFn } from "@tanstack/react-start";
import { getSession } from "#/lib/auth/get-session";

export const throwServerErrorServerFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  throw new Error("Sentry test: server error");
});
