import { z } from "zod";

const MessageBaseSchema = z.object({
  id: z.number(),
  createdAt: z.date().transform((v) => v.toISOString()),
  userId: z.number(),
});

export const MessageSchema = z.discriminatedUnion("kind", [
  MessageBaseSchema.extend({ kind: z.literal("text"), payload: z.object({ text: z.string() }) }),
  MessageBaseSchema.extend({ kind: z.literal("audio"), payload: z.object({ url: z.string(), fileName: z.string() }) }),
]);

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
  .pipe(MessageSchema);

export const RoomInputSchema = z.looseObject({
  token: z.string().min(1).optional(),
  roomId: z.string().min(1).max(64),
});
