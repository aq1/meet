import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";
import { db } from "#/lib/db";

export const roomExists = async (roomId: string) => {
  const row = await db
    .selectFrom("room")
    .select("id")
    .where("id", "=", roomId)
    .executeTakeFirst();
  return Boolean(row);
};

export const getRoom = createServerFn({ method: "GET" })
  .validator((roomId: string) => roomId)
  .handler(async ({ data }) => ({ exists: await roomExists(data) }));

export const createRoom = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session) {
      throw new Response("Unauthorized", { status: 401 });
    }
    const id = Math.random().toString(36).slice(2, 10);
    const roomId = import.meta.env.PROD ? id : `test-${id}`;
    await db
      .insertInto("room")
      .values({ id: roomId, createdBy: session.user.id })
      .execute();
    return { roomId };
  },
);
