import { defineRelationsPart } from "drizzle-orm";
import { session } from "./session";
import { user } from "./user";

export const sessionRelations = defineRelationsPart({ session, user }, (r) => ({
  session: {
    user: r.one.user({ from: r.session.userId, to: r.user.id, optional: false }),
  },
}));
