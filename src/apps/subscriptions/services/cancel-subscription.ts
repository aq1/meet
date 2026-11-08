import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { userSubscription } from "../models";

type CancelSubscriptionT = {
  userId: number;
  status: "cancelled" | "expired";
};

export const cancelSubscription = async ({ userId, status }: CancelSubscriptionT) => {
  await db
    .update(userSubscription)
    .set({ status })
    .where(and(eq(userSubscription.userId, userId), eq(userSubscription.status, "active")));
};
