import { createServerFn } from "@tanstack/react-start";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { db } from "@/lib/db/client";
import type { ChatMessageT } from "../shared/types";

export const getChatMessagesFn = createServerFn({ method: "GET" })
  .middleware([anyUserMiddleware])
  .validator((data: { roomId: string }) => data)
  .handler(async ({ data }) => {
    const activeRoom = await db.query.room.findFirst({
      columns: { id: true, publicId: true },
      where: { publicId: data.roomId, finishedAt: { isNull: true } },
    });

    if (!activeRoom) {
      throw new Response("Room not found", { status: 404 });
    }
    const messages = await db.query.chatMessage.findMany({
      where: { roomId: activeRoom.id },
      orderBy: { id: "asc" },
    });

    return messages.map(
      (message) =>
        ({
          id: message.id,
          createdAt: message.createdAt.toISOString(),
          from: message.userId,
          kind: message.kind,
          payload: message.payload,
        }) as ChatMessageT,
    );
  });
