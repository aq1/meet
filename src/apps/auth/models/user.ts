import { boolean, pgEnum, snakeCase, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";

export const langEnum = pgEnum("lang", ["ru", "en"]);

export const user = snakeCase.table("auth_user", {
  ...baseColumns,
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: text().notNull().default(""),
  lang: langEnum().notNull().default("ru"),
  color: varchar({ length: 255 }).notNull().default(""),
  role: text().notNull().default("user"),
  banned: boolean().notNull().default(false),
  banReason: text().notNull().default(""),
  banExpires: timestamp({ precision: 6, withTimezone: true }),
  isAnonymous: boolean().notNull().default(false),
});
