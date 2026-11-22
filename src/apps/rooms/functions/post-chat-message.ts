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
  z.object({ kind: z.literal("text"), text: z.string().min(1).max(3000) }),
  z.object({ kind: z.literal("audio"), fileId: z.number().min(1) }),
]);

const validateFileAttachment = async (data: z.output<typeof ChatMessageSchema>, userId: number) => {
  if (data.kind !== "audio") {
    return null;
  }
  const found = await db.query.file.findFirst({
    where: { id: data.fileId, userId: userId, status: "uploaded", kind: "teacher-audio" },
    columns: { id: true },
  });
  if (!found) {
    throw new Error("File not found");
  }
  return data.fileId;
};

export const postChatMessageFn = createServerFn({ method: "POST" })
  .middleware([activeRoomParticipantMiddleware, anyUserMiddleware])
  .validator(ChatMessageSchema)
  .handler(async ({ context, data }) => {
    const fileId = await validateFileAttachment(data, context.userId);
    const [inserted] = await db
      .insert(chatMessage)
      .values({
        roomId: context.room.id,
        userId: context.userId,
        kind: data.kind,
        text: data.kind === "text" ? data.text : "",
        fileId,
      })
      .returning({ id: chatMessage.id });

    const message = await db.query.chatMessage.findFirst({ where: { id: inserted.id }, with: { file: true } });
    if (!message) {
      throw new Error("Unexpected error");
    }

    await roomServiceClient.sendData(
      context.room.publicId,
      encoder.encode(JSON.stringify(prepareChatMessage(message))),
      DataPacket_Kind.RELIABLE,
      {
        topic: "chat",
      },
    );
  });
