import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { authMiddleware } from "@/apps/auth/services/auth-middleware";
import { room } from "@/apps/rooms/models/room";
import { db } from "@/lib/db/client";

export const listMyRoomsServerFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const rows = await db.query.room.findMany({
      where: eq(room.createdBy, Number(context.session.user.id)),
      orderBy: desc(room.createdAt),
      limit: 100,
      with: {
        roomUsers: {
          columns: {},
          with: { user: { columns: { id: true, name: true, image: true } } },
        },
      },
    });
    return rows.map(({ roomUsers, ...rest }) => ({ ...rest, users: roomUsers.map((ru) => ru.user) }));
  });
