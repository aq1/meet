import { z } from "zod";

const SerializedMessageSchema = z.discriminatedUnion("kind", [
  z.object({
    id: z.number(),
    userId: z.number(),
    kind: z.literal("text"),
    text: z.string(),
  }),
  z.object({
    id: z.number(),
    userId: z.number(),
    kind: z.literal("audio"),
    file: z.object({ url: z.url(), filename: z.string() }),
  }),
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
  .pipe(SerializedMessageSchema);

export const RoomInputSchema = z.looseObject({
  token: z.string().min(1).optional(),
  roomId: z.string().min(1).max(64),
});
