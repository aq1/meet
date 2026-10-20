import { integer, snakeCase, unique } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { baseColumns } from "@/lib/db/columns";
import { room } from "./room";

export const roomUser = snakeCase.table(
  "rooms_room_user",
  {
    ...baseColumns,
    roomId: integer()
      .notNull()
      .references(() => room.id),
    userId: integer()
      .notNull()
      .references(() => user.id),
  },
  (table) => [unique().on(table.roomId, table.userId)],
);
