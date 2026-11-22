import { z } from "zod";
import type { file } from "@/apps/storage/models/file";
import { getPublicDownloadUrl } from "@/apps/storage/services/get-public-download-url";
import type { chatMessage } from "../../models";

type DbChatMessageT = typeof chatMessage.$inferSelect & { file?: typeof file.$inferSelect | null };

const SerializedMessageSchema = z.discriminatedUnion("kind", [
  z.object({ id: z.number(), userId: z.number(), kind: z.literal("text"), text: z.string() }),
  z.object({
    id: z.number(),
    userId: z.number(),
    kind: z.literal("audio"),
    file: z.object({ key: z.string(), bucket: z.string(), filename: z.string() }).transform((v) => {
      return { url: getPublicDownloadUrl(v), filename: v.filename };
    }),
  }),
]);

export const prepareChatMessage = (message: DbChatMessageT) => {
  return SerializedMessageSchema.parse(message);
};
