import { createServerFn } from "@tanstack/react-start";
import { DataPacket_Kind } from "livekit-server-sdk";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activeRoomParticipantMiddleware } from "../middleware/active-room-participant-middleware";
import { chatMessage } from "../models";
import { roomServiceClient } from "../services/livekit/room-service-client";

const encoder = new TextEncoder();

const ChatMessageSchema = z.xor([
  z.object({
    kind: z.literal("text"),
    payload: z.object({ text: z.string() }),
  }),
  z.object({
    kind: z.literal("audio"),
    payload: z.object({ fileName: z.string(), url: z.string() }),
  }),
]);

export const postChatMessageFn = createServerFn({ method: "POST" })
  .middleware([activeRoomParticipantMiddleware])
  .validator(ChatMessageSchema)
  .handler(async ({ context, data }) => {
    const [message] = await db
      .insert(chatMessage)
      .values({
        roomId: context.room.id,
        userId: Number(context.session.user.id),
        kind: data.kind,
        payload: data.payload,
      })
      .returning();

    await roomServiceClient.sendData(
      context.room.publicId,
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
