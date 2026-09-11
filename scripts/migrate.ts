import { promises as fs } from "node:fs";
import path from "node:path";
import { FileMigrationProvider, Migrator } from "kysely/migration";
import { db, sql } from "#/lib/db";

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, "../src/lib/db/migrations"),
  }),
});

const direction = process.argv[2] ?? "latest";
const { error, results } =
  direction === "down" ? await migrator.migrateDown() : await migrator.migrateToLatest();

for (const r of results ?? []) {
  console.log(`${r.status.toLowerCase()} ${r.direction.toLowerCase()} ${r.migrationName}`);
}
if (!results?.length && !error) {
  console.log("database is up to date");
}

await db.destroy();
await sql.end();

if (error) {
  console.error(error);
  process.exit(1);
}
