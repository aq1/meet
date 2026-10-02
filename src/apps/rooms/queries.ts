import { and, desc, eq, isNull } from "drizzle-orm";
import type { WebhookEvent } from "livekit-server-sdk";
import { user } from "@/apps/auth/models/user";
import { db } from "@/lib/db/client";
import { room } from "./models/room";
import { roomEvent } from "./models/room-event";
import { roomUser } from "./models/room-user";

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

export const roomIsActive = async (publicId: string) => {
  const [row] = await db
    .select({ id: room.id })
    .from(room)
    .where(and(eq(room.publicId, publicId), isNull(room.finishedAt)))
    .limit(1);
  return Boolean(row);
};

export const updateRoom = async (publicId: string, fields: Partial<typeof room.$inferInsert>) => {
  await db.update(room).set(fields).where(eq(room.publicId, publicId));
};

export const listMyRooms = async (userId: number, offset: number, limit: number) => {
  const rows = await db.query.room.findMany({
    where: eq(room.createdBy, userId),
    orderBy: desc(room.createdAt),
    limit,
    offset,
    with: {
      roomUsers: {
        columns: {},
        with: { user: { columns: { id: true, name: true, image: true } } },
      },
    },
  });
  return rows.map(({ roomUsers, ...rest }) => ({ ...rest, users: roomUsers.map((ru) => ru.user) }));
};

export const createRoomUser = async (roomId: number, userId: number) => {
  return await db.insert(roomUser).values({ roomId, userId });
};

export const reassignRoomUsers = async (fromUserId: number, toUserId: number) => {
  await db.update(roomUser).set({ userId: toUserId }).where(eq(roomUser.userId, fromUserId));
};

type LogLivekitEventT = { eventId: string; eventName: string; roomName: string; data: WebhookEvent };

export const logLivekitEvent = async ({ eventId, eventName, roomName, data }: LogLivekitEventT) => {
  const rows = await db
    .insert(roomEvent)
    .values({ eventId, event: eventName, roomName, data })
    .onConflictDoNothing({ target: roomEvent.eventId })
    .returning({ id: roomEvent.id });
  return rows.length > 0;
};
