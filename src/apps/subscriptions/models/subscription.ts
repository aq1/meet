import { integer, pgEnum, snakeCase, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "@/lib/db/columns";
import { SUBSCRIPTION_KIND_VALUES } from "../shared/enums";

export const subscriptionKindEnum = pgEnum("subscription_kind", SUBSCRIPTION_KIND_VALUES);

export const subscription = snakeCase.table("subscriptions_subscription", {
  ...baseColumns,
  title: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  kind: subscriptionKindEnum().notNull(),
});
