import { s3 } from "bun";
import { z } from "zod";

const MessageBaseSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  userId: z.number(),
});

export const MessageSchema = z.discriminatedUnion("kind", [
  MessageBaseSchema.extend({ kind: z.literal("text"), payload: z.object({ text: z.string() }) }),
  MessageBaseSchema.extend({
    kind: z.literal("audio"),
    payload: z.object({ key: z.string(), fileName: z.string() }),
  }).transform((data) => {
    return {
      ...data,
      payload: {
        ...data.payload,
        url: s3.presign(data.payload.key, {
          method: "GET",
          expiresIn: 60 * 60,
        }),
      },
    };
  }),
]);
