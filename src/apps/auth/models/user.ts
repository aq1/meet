import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";

export const user = pgTable("auth_user", {
  ...baseColumns,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  isAnonymous: boolean("is_anonymous").default(false),
});
