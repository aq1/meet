import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("Define DATABASE_URL");
}

const db = drizzle(url);
await migrate(db, { migrationsFolder: "./drizzle" });
await db.$client.end();
console.log("Migrations applied");
