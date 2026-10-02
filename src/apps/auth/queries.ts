import { db } from "@/lib/db/client";
import { user } from "./models/user";

export const createTempUser = async (name: string) => {
  const [row] = await db
    .insert(user)
    .values({ email: `temp${crypto.randomUUID()}@snek.sh`, emailVerified: true, name })
    .returning({ id: user.id });
  return row;
};
