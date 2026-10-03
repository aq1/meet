import { integer, timestamp } from "drizzle-orm/pg-core";

export const baseColumns = {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};
