import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";
import { user } from "./user";
export const session = pgTable(
  "auth_session",
  {
    ...baseColumns,
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);
