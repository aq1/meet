import { defineRelationsPart } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { chatMessage } from "./chat-message";

export const chatRelations = defineRelationsPart({ chatMessage, user }, (r) => ({
  chatMessage: {
    user: r.one.user({ from: r.chatMessage.userId, to: r.user.id, optional: false }),
  },
}));
