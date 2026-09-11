import { CamelCasePlugin, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { env } from "#/env";

export const sql = postgres(env.DATABASE_URL);

export const db = new Kysely<unknown>({
  dialect: new PostgresJSDialect({ postgres: sql }),
  plugins: [new CamelCasePlugin()],
});
