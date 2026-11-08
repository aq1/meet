import { index, integer, snakeCase, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "@/apps/organizations/models/organization";
import { baseColumns } from "@/lib/db/columns";
import { user } from "./user";
export const session = snakeCase.table(
  "auth_session",
  {
    ...baseColumns,
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    token: text().notNull().unique(),
    ipAddress: text(),
    userAgent: text(),
    userId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    impersonatedBy: text().notNull().default(""),
    activeOrganizationId: integer().references(() => organization.id, { onDelete: "set null" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);
