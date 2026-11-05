import { snakeCase, text } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";

export const organization = snakeCase.table("organizations_organization", {
  ...baseColumns,
  name: text().notNull(),
  slug: text().notNull().unique(),
  logo: text().notNull().default(""),
  metadata: text().notNull().default(""),
});
