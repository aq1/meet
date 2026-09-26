import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth/server";

// TODO: Learn how really work with session in tanstack and better auth

export const ensureSession = async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};
