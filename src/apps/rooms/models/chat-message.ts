import { integer, pgEnum, snakeCase, text } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { file } from "@/apps/storage/models/file";
import { baseColumns } from "@/lib/db/columns";
import { CHAT_MESSAGE_KIND_VALUES } from "../shared/enums";
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
  text: text().notNull().default(""),
  fileId: integer().references(() => file.id, { onDelete: "restrict" }),
});
