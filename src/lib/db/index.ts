import { CamelCasePlugin, type Generated, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { env } from "#/env";

export type RoomTable = {
  id: string;
  createdBy: string | null;
  createdAt: Generated<Date>;
};

export type Database = {
  room: RoomTable;
};

export const sql = postgres(env.DATABASE_URL);

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({ postgres: sql }),
  plugins: [new CamelCasePlugin()],
});
