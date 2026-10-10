import { boolean, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";

export const langEnum = pgEnum("lang", ["ru", "en"]);

export const user = pgTable("auth_user", {
  ...baseColumns,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image").notNull().default(""),
  lang: langEnum().notNull().default("ru"),
  color: varchar("color", { length: 255 }).notNull().default(""),
  isAnonymous: boolean("is_anonymous").default(false),
});
