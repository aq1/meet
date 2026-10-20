import { defineRelationsPart } from "drizzle-orm";
import { account } from "./account";
import { user } from "./user";
export const accountRelations = defineRelationsPart({ account, user }, (r) => ({
  account: {
    user: r.one.user({ from: r.account.userId, to: r.user.id, optional: false }),
  },
}));
