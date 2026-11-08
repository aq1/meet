import { integer, pgEnum, snakeCase, text, unique, varchar } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models";
import { baseColumns } from "@/lib/db/columns";
import { FILE_KIND_VALUES, FILE_STATUS_VALUES } from "../shared/enums";

export const fileKindEnum = pgEnum("file_kind", FILE_KIND_VALUES);
export const fileStatusEnum = pgEnum("file_status", FILE_STATUS_VALUES);

export const file = snakeCase.table(
  "storage_file",
  {
    ...baseColumns,
    userId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    filename: varchar({ length: 255 }).notNull(),
    contentType: varchar({ length: 255 }).notNull(),
    size: integer().notNull(),
    bucket: varchar({ length: 255 }).notNull(),
    key: text().notNull(),
    kind: fileKindEnum().notNull(),
    status: fileStatusEnum().notNull().default("created"),
  },
  (table) => [unique().on(table.bucket, table.key)],
);
