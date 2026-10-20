import { defineRelationsPart } from "drizzle-orm";
import { account } from "./account";
import { session } from "./session";
import { user } from "./user";
export const userRelations = defineRelationsPart({ user, session, account }, (r) => ({
  user: {
    sessions: r.many.session({ from: r.user.id, to: r.session.userId }),
    accounts: r.many.account({ from: r.user.id, to: r.account.userId }),
  },
}));
