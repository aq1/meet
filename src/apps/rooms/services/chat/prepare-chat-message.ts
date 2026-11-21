import type { chatMessage } from "../../models";
import { MessageSchema } from "../../shared/schemas";

export const prepareChatMessage = (message: typeof chatMessage.$inferSelect) => {
  const result = MessageSchema.safeParse(message);
  if (!result.success) {
    throw new Error("Unexpected Message");
  }
  return result.data;
};
