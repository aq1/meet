import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { db } from "@/lib/db/client";

export const listMyRoomsServerFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const rows = await db.query.room.findMany({
      where: { roomUsers: { userId: context.userId } },
      orderBy: { createdAt: "desc" },
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
