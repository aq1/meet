import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/client";
import { activeRoomParticipantMiddleware } from "../middleware/active-room-participant-middleware";
import type { ChatMessageT } from "../shared/types";

export const getChatMessagesFn = createServerFn({ method: "GET" })
  .middleware([activeRoomParticipantMiddleware])
  .handler(async ({ context }) => {
    const messages = await db.query.chatMessage.findMany({
      where: { roomId: context.room.id },
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
