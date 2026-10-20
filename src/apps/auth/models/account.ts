import { index, integer, snakeCase, text, timestamp } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";
import { user } from "./user";

export const account = snakeCase.table(
  "auth_account",
  {
    ...baseColumns,
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);
