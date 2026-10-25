import { z } from "zod";

const MessageBaseSchema = z.object({
  id: z.number(),
  createdAt: z.date().transform((v) => v.toISOString()),
  userId: z.number(),
});

export const MessageSchema = z.discriminatedUnion("kind", [
  MessageBaseSchema.extend({ kind: z.literal("text"), payload: z.object({ text: z.string() }) }),
  MessageBaseSchema.extend({ kind: z.literal("audio"), payload: z.object({ key: z.string(), fileName: z.string() }) }),
]);

const ChatMessageBaseSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  userId: z.number(),
});

export const ChatMessageSchema = z
  .string()
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Invalid JSON",
      });
      return z.NEVER;
    }
  })
  .pipe(
    z.discriminatedUnion("kind", [
      ChatMessageBaseSchema.extend({ kind: z.literal("text"), payload: z.object({ text: z.string() }) }),
      ChatMessageBaseSchema.extend({
        kind: z.literal("audio"),
        payload: z.object({ key: z.string(), fileName: z.string(), url: z.string() }),
      }),
    ]),
  );

export const RoomInputSchema = z.looseObject({
  token: z.string().min(1).optional(),
  roomId: z.string().min(1).max(64),
});
