import { db } from "@/lib/db/client";
import { userSubscription } from "../models";
import type { SubscriptionKindT } from "../shared/enums";

type CreateSubscriptionT = {
  userId: number;
  kind: SubscriptionKindT;
  days: number;
};

export const createSubscription = async ({ userId, kind, days }: CreateSubscriptionT) => {
  const subscription = await db.query.subscription.findFirst({ where: { kind }, columns: { id: true } });
  if (!subscription) {
    throw new Error("Subscription was not found");
  }

  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + days);

  await db.insert(userSubscription).values({ userId, subscriptionId: subscription.id, endsAt });
};
