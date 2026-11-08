export const SUBSCRIPTION_KIND_VALUES = ["friend", "single", "organization"] as const;
export type SubscriptionKindT = (typeof SUBSCRIPTION_KIND_VALUES)[number];

export const SUBSCRIPTION_STATUS_VALUES = ["active", "expired", "cancelled"] as const;
export type SubscriptionStatusT = (typeof SUBSCRIPTION_STATUS_VALUES)[number];
