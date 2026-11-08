import { integer, pgEnum, snakeCase, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { baseColumns } from "@/lib/db/columns";
import { SUBSCRIPTION_STATUS_VALUES } from "../shared/enums";
import { subscription } from "./subscription";

export const subscriptionStatusEnum = pgEnum("user_subscription_status", SUBSCRIPTION_STATUS_VALUES);

export const userSubscription = snakeCase.table("subscriptions_user_subscription", {
  ...baseColumns,
  userId: integer()
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  subscriptionId: integer()
    .notNull()
    .references(() => subscription.id, { onDelete: "restrict" }),
  status: subscriptionStatusEnum().notNull().default("active"),
  endsAt: timestamp({ withTimezone: true }).notNull(),
});
