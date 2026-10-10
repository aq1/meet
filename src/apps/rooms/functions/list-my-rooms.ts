import { createServerFn } from "@tanstack/react-start";
import { desc, eq, inArray } from "drizzle-orm";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { room } from "@/apps/rooms/models/room";
import { roomUser } from "@/apps/rooms/models/room-user";
import { db } from "@/lib/db/client";

export const listMyRoomsServerFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const rows = await db.query.room.findMany({
      where: inArray(
        room.id,
        db
          .select({ id: roomUser.roomId })
          .from(roomUser)
          .where(eq(roomUser.userId, Number(context.session.user.id))),
      ),
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
