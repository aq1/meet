import { integer, timestamp } from "drizzle-orm/pg-core";

export const baseColumns = {
  id: integer().generatedByDefaultAsIdentity().primaryKey(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};
