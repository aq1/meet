import { defineRelationsPart } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { subscription } from "./subscription";
import { userSubscription } from "./user-subscription";

export const subscriptionRelations = defineRelationsPart({ subscription, userSubscription, user }, (r) => ({
  subscription: {
    userSubscriptions: r.many.userSubscription({
      from: r.subscription.id,
      to: r.userSubscription.subscriptionId,
    }),
    users: r.many.user({
      from: r.subscription.id.through(r.userSubscription.subscriptionId),
      to: r.user.id.through(r.userSubscription.userId),
    }),
  },
  userSubscription: {
    subscription: r.one.subscription({
      from: r.userSubscription.subscriptionId,
      to: r.subscription.id,
      optional: false,
    }),
    user: r.one.user({ from: r.userSubscription.userId, to: r.user.id, optional: false }),
  },
}));
