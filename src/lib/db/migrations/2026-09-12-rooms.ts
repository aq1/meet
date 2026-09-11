import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("room")
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("created_by", "text", (c) =>
      c.references("user.id").onDelete("set null"),
    )
    .addColumn("created_at", "timestamptz", (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropTable("room").execute();
}
