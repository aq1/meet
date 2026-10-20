import { index, integer, snakeCase, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { baseColumns } from "@/lib/db/columns";

export const room = snakeCase.table(
  "rooms_room",
  {
    ...baseColumns,
    publicId: text().notNull().unique(),
    createdBy: integer()
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    finishedAt: timestamp({ withTimezone: true }),
    egressUrl: text().default(""),
  },
  (table) => [index("room_created_by_idx").on(table.createdBy), index("room_public_id_idx").on(table.publicId)],
);
