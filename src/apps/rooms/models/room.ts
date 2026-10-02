import { desc, eq, sql } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { db } from "@/lib/db/client";
import { roomUser } from "./room-user";

export const room = pgTable(
  "rooms_room",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    publicId: text("public_id").notNull().unique(),
    createdBy: integer("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    egressUrl: text("egress_url").default(""),
  },
  (table) => [index("room_created_by_idx").on(table.createdBy), index("room_public_id_idx").on(table.publicId)],
);

export const createRoom = async (publicId: string, createdBy: number) => {
  await db.insert(room).values({ publicId, createdBy });
};

export const getRoom = async (publicId: string) => {
  const [row] = await db
    .select({
      id: room.id,
      createdAt: room.createdAt,
      finishedAt: room.finishedAt,
      publicId: room.publicId,
      user_id: user.id,
      username: user.name,
      email: user.email,
    })
    .from(room)
    .innerJoin(user, eq(user.id, room.createdBy))
    .where(eq(room.publicId, publicId))
    .limit(1);
  return row;
};

export const roomExists = async (publicId: string) => {
  const [row] = await db.select({ id: room.id }).from(room).where(eq(room.publicId, publicId)).limit(1);
  return Boolean(row);
};

export const updateRoom = async (publicId: string, fields: Partial<typeof room.$inferInsert>) => {
  await db.update(room).set(fields).where(eq(room.publicId, publicId));
};

export const listMyRooms = async (userId: number, offset: number, limit: number) => {
  return await db
    .select({
      id: room.id,
      publicId: room.publicId,
      createdAt: room.createdAt,
      createdBy: room.createdBy,
      finishedAt: room.finishedAt,
      egressUrl: room.egressUrl,
      users: sql<{ id: number; name: string; image: string | null }[]>`coalesce((
        select json_agg(json_build_object('id', ${user.id}, 'name', ${user.name}, 'image', ${user.image}))
        from ${roomUser}
        inner join ${user} on ${user.id} = ${roomUser.userId}
        where ${roomUser.roomId} = ${room.id}
      ), '[]'::json)`,
    })
    .from(room)
    .where(eq(room.createdBy, userId))
    .orderBy(desc(room.createdAt))
    .limit(limit)
    .offset(offset);
};
