import { defineRelationsPart } from "drizzle-orm";
import { user } from "@/apps/auth/models";
import { file } from "./file";

export const fileRelations = defineRelationsPart({ user, file }, (r) => {
  return {
    file: {
      user: r.one.user({ from: r.file.userId, to: r.user.id, optional: false }),
    },
  };
});
