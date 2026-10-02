import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";

export const room = pgTable(
  "rooms_room",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    publicId: text("public_id").notNull().unique(),
    createdBy: integer("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    egressUrl: text("egress_url").default(""),
  },
  (table) => [
    index("room_created_by_idx").on(table.createdBy),
    index("room_public_id_idx").on(table.publicId),
  ],
);
