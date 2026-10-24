import { s3 } from "bun";
import type { chatMessage } from "../../models";
import { MessageSchema } from "../../shared/schemas";

const DOWNLOAD_URL_TTL = 24 * 60 * 60;

export const prepareChatMessage = (message: typeof chatMessage.$inferSelect) => {
  const result = MessageSchema.safeParse(message);
  if (!result.success) {
    throw new Error("Unexpected Message");
  }
  const data = result.data;
  if (data.kind === "audio") {
    const url = s3.presign(data.payload.key, { method: "GET", expiresIn: DOWNLOAD_URL_TTL });
    return { ...data, payload: { ...data.payload, url } };
  }
  return data;
};
