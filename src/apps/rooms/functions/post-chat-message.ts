import { createServerFn } from "@tanstack/react-start";
import { DataPacket_Kind } from "livekit-server-sdk";
import { z } from "zod";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { db } from "@/lib/db/client";
import { activeRoomParticipantMiddleware } from "../middleware/active-room-participant-middleware";
import { chatMessage } from "../models";
import { prepareChatMessage } from "../services/chat/prepare-chat-message";
import { roomServiceClient } from "../services/livekit/room-service-client";

const encoder = new TextEncoder();

const ChatMessageSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("text"),
    payload: z.object({ text: z.string().max(3000) }),
  }),
  z.object({
    kind: z.literal("audio"),
    payload: z.object({ id: z.number() }),
  }),
]);

const serializePayload = async (data: z.output<typeof ChatMessageSchema>, userId: number) => {
  switch (data.kind) {
    case "text":
      return data.payload;
    case "audio": {
      const record = await db.query.file.findFirst({ where: { id: data.payload.id, userId } });
      if (!record) {
        throw new Error("Unknown file");
      }
      return { key: record.key, fileName: record.filename };
    }
    default:
      throw new Error("Unknown message kind");
  }
};

export const postChatMessageFn = createServerFn({ method: "POST" })
  .middleware([activeRoomParticipantMiddleware, anyUserMiddleware])
  .validator(ChatMessageSchema)
  .handler(async ({ context, data }) => {
    const payload = await serializePayload(data, context.userId);
    const [message] = await db
      .insert(chatMessage)
      .values({
        roomId: context.room.id,
        userId: context.userId,
        kind: data.kind,
        payload,
      })
      .returning();

    await roomServiceClient.sendData(
      context.room.publicId,
      encoder.encode(JSON.stringify(prepareChatMessage(message))),
      DataPacket_Kind.RELIABLE,
      {
        topic: "chat",
      },
    );

    return message;
  });
