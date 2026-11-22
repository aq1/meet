import { defineRelations } from "drizzle-orm";
import { accountRelations, sessionRelations, userRelations } from "@/apps/auth/models";
import { roomRelations, roomUserRelations } from "@/apps/rooms/models";
import { chatMessageRelations } from "@/apps/rooms/models/chat-message-relations";
import { fileRelations } from "@/apps/storage/models";
import { subscriptionRelations } from "@/apps/subscriptions/models";
import * as schema from "./schema";

export const relations = {
  ...defineRelations(schema),
  ...userRelations,
  ...accountRelations,
  ...sessionRelations,
  ...roomRelations,
  ...roomUserRelations,
  ...chatMessageRelations,
  ...fileRelations,
  ...subscriptionRelations,
};
