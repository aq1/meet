import { env } from "#/env";

export const login = (password: string) => {
  if (password !== env.MEET_PASSWORD) {
    return { ok: false, msg: "Wrong Password" };
  }
  return { ok: true, msg: "" };
};
