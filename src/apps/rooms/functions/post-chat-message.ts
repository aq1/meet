import { createServerFn } from "@tanstack/react-start";
import { DataPacket_Kind } from "livekit-server-sdk";
import { z } from "zod";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { db } from "@/lib/db/client";
import { chatMessage } from "../models";
import { roomServiceClient } from "../services/livekit/room-service-client";

const encoder = new TextEncoder();

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
  .middleware([anyUserMiddleware])
  .validator(ChatMessageSchema)
  .handler(async ({ context, data }) => {
    const activeRoom = await db.query.room.findFirst({
      columns: { id: true, publicId: true },
      where: { publicId: data.roomId, finishedAt: { isNull: true } },
    });
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

    await roomServiceClient.sendData(
      activeRoom.publicId,
      encoder.encode(
        JSON.stringify({
          id: message.id,
          createdAt: message.createdAt.toISOString(),
          from: Number(context.session.user.id),
          kind: message.kind,
          payload: message.payload,
        }),
      ),
      DataPacket_Kind.RELIABLE,
      {
        topic: "chat",
      },
    );

    return message;
  });
