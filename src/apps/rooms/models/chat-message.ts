import { integer, jsonb, pgEnum, snakeCase } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { baseColumns } from "@/lib/db/columns";
import type { ChatMessagePayloadT } from "../shared/types";
import { room } from "./room";

export const kindEnum = pgEnum("chat_message_kind", ["text", "audio"]);

export const chatMessage = snakeCase.table("rooms_chat_message", {
  ...baseColumns,
  roomId: integer()
    .notNull()
    .references(() => room.id, { onDelete: "cascade" }),
  userId: integer()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  kind: kindEnum().notNull(),
  payload: jsonb().$type<ChatMessagePayloadT>().notNull(),
});
