import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";
import { user } from "./user";

export const account = pgTable(
  "auth_account",
  {
    ...baseColumns,
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);
