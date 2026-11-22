import { defineRelationsPart } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { file } from "@/apps/storage/models";
import { chatMessage } from "./chat-message";

export const chatMessageRelations = defineRelationsPart({ chatMessage, user, file }, (r) => ({
  chatMessage: {
    user: r.one.user({ from: r.chatMessage.userId, to: r.user.id, optional: false }),
    file: r.one.file({ from: r.chatMessage.fileId, to: r.file.id, optional: true }),
  },
}));
