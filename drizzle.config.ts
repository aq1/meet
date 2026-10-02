import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Define DATABASE_URL");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/apps/**/models/**",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
