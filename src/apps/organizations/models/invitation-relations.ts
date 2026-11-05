import { defineRelationsPart } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { invitation } from "./invitation";
import { organization } from "./organization";

export const invitationRelations = defineRelationsPart({ invitation, organization, user }, (r) => ({
  invitation: {
    organization: r.one.organization({
      from: r.invitation.organizationId,
      to: r.organization.id,
      optional: false,
    }),
    inviter: r.one.user({ from: r.invitation.inviterId, to: r.user.id, optional: false }),
  },
}));
