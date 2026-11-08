import { createMiddleware } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { db } from "@/lib/db/client";
import type { SubscriptionKindT } from "../shared/enums";

export function subscriptionMiddleware(subscriptionKinds: SubscriptionKindT[]) {
  return createMiddleware({ type: "function" })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      const userSubscription = await db.query.userSubscription.findFirst({
        where: {
          userId: context.userId,
          endsAt: { gt: new Date() },
          status: "active",
          subscription: {
            kind: { in: subscriptionKinds },
          },
        },
        with: {
          subscription: true,
        },
      });

      if (!userSubscription) {
        throw new Response("Forbidden", { status: 403 });
      }

      return await next({ context: { userSubscription } });
    });
}
