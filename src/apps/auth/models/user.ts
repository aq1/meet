import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { db } from "@/lib/db/client";

export const user = pgTable("auth_user", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
});

export const createTempUser = async (name: string) => {
  const [row] = await db
    .insert(user)
    .values({ email: `temp${crypto.randomUUID()}@snek.sh`, emailVerified: true, name })
    .returning({ id: user.id });
  return row;
};
