import { createServerFn } from "@tanstack/react-start";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { db } from "@/lib/db/client";
import { roomTokenMiddleware } from "../middleware/room-token-middleware";
import { chatMessage, room } from "../models";

const ChatMessageSchema = z.xor([
  z.object({
    roomId: z.string(),
    kind: z.literal("text"),
    payload: z.object({ text: z.string() }),
  }),
  z.object({
    roomId: z.string(),
    kind: z.literal("audio"),
    payload: z.object({ fileName: z.string(), url: z.string() }),
  }),
]);

export const postChatMessageFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware, roomTokenMiddleware])
  .validator(ChatMessageSchema)
  .handler(async ({ context, data }) => {
    const [activeRoom] = await db
      .select({ id: room.id })
      .from(room)
      .where(and(eq(room.publicId, data.roomId), isNull(room.finishedAt)))
      .limit(1);
    if (!activeRoom) {
      throw new Response("Room not found", { status: 404 });
    }
    const [message] = await db
      .insert(chatMessage)
      .values({
        roomId: activeRoom.id,
        userId: Number(context.session.user.id),
        kind: data.kind,
        payload: data.payload,
      })
      .returning();
    return message;
  });
