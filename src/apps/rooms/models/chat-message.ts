import { integer, jsonb, pgEnum, snakeCase } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { baseColumns } from "@/lib/db/columns";
import { CHAT_MESSAGE_KIND_VALUES } from "../shared/enums";
import type { ChatMessagePayloadT } from "../shared/types";
import { room } from "./room";

export const chatMessageKindEnum = pgEnum("chat_message_kind", CHAT_MESSAGE_KIND_VALUES);

export const chatMessage = snakeCase.table("rooms_chat_message", {
  ...baseColumns,
  roomId: integer()
    .notNull()
    .references(() => room.id, { onDelete: "restrict" }),
  userId: integer()
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  kind: chatMessageKindEnum().notNull(),
  payload: jsonb().$type<ChatMessagePayloadT>().notNull(),
});
