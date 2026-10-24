import { createServerFn } from "@tanstack/react-start";
import { DataPacket_Kind } from "livekit-server-sdk";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activeRoomParticipantMiddleware } from "../middleware/active-room-participant-middleware";
import { chatMessage } from "../models";
import { prepareChatMessage } from "../services/chat/serializer-chat-payload";
import { roomServiceClient } from "../services/livekit/room-service-client";

const encoder = new TextEncoder();

const ChatMessageSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("text"),
    payload: z.object({ text: z.string() }),
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
        throw new Error("Unkown file");
      }
      return { key: record.key, fileName: record.filename };
    }
    default:
      throw new Error("Unkown message kind");
  }
};

export const postChatMessageFn = createServerFn({ method: "POST" })
  .middleware([activeRoomParticipantMiddleware])
  .validator(ChatMessageSchema)
  .handler(async ({ context, data }) => {
    const payload = await serializePayload(data, Number(context.session.user.id));
    const [message] = await db
      .insert(chatMessage)
      .values({
        roomId: context.room.id,
        userId: Number(context.session.user.id),
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
