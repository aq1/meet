import { integer, pgEnum, snakeCase, text, unique, varchar } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models";
import { baseColumns } from "@/lib/db/columns";
import { UPLOAD_KIND_LIST } from "../shared/types";

export const fileKind = pgEnum("file_kind", UPLOAD_KIND_LIST);
export const fileStatus = pgEnum("file_status", ["created", "uploaded"]);

export const file = snakeCase.table(
  "storage_file",
  {
    ...baseColumns,
    userId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    filename: varchar({ length: 255 }).notNull(),
    contentType: varchar({ length: 255 }).notNull(),
    size: integer().notNull(),
    bucket: varchar({ length: 255 }).notNull(),
    key: text().notNull(),
    kind: fileKind().notNull(),
    status: fileStatus().notNull().default("created"),
  },
  (table) => [unique().on(table.bucket, table.key)],
);
