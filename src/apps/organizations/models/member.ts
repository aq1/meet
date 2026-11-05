import { index, integer, snakeCase, text } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { baseColumns } from "@/lib/db/columns";
import { organization } from "./organization";

export const member = snakeCase.table(
  "organizations_member",
  {
    ...baseColumns,
    organizationId: integer()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text().notNull().default("member"),
  },
  (table) => [index("member_organizationId_idx").on(table.organizationId), index("member_userId_idx").on(table.userId)],
);
