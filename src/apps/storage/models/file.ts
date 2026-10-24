import { integer, snakeCase, text, unique, varchar } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models";
import { baseColumns } from "@/lib/db/columns";

export const file = snakeCase.table(
  "storage_file",
  {
    ...baseColumns,
    userId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    filename: varchar({ length: 255 }).notNull(),
    content_type: varchar({ length: 255 }).notNull(),
    size: integer().notNull(),
    bucket: varchar({ length: 255 }).notNull(),
    key: text().notNull(),
  },
  (table) => [unique().on(table.bucket, table.key)],
);
