export const INVITATION_STATUS_VALUES = ["pending", "accepted", "rejected", "canceled"] as const;
export type InvitationStatusT = (typeof INVITATION_STATUS_VALUES)[number];
