import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";
export const verification = pgTable(
  "auth_verification",
  {
    ...baseColumns,
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);
