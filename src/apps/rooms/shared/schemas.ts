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
