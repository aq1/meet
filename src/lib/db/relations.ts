import { defineRelations } from "drizzle-orm";
import { accountRelations, sessionRelations, userRelations } from "@/apps/auth/models";
import { roomRelations, roomUserRelations } from "@/apps/rooms/models";
import * as schema from "./schema";

export const relations = {
  ...defineRelations(schema),
  ...userRelations,
  ...accountRelations,
  ...sessionRelations,
  ...roomRelations,
  ...roomUserRelations,
};
