import { defineRelationsPart } from "drizzle-orm";
import { invitation } from "./invitation";
import { member } from "./member";
import { organization } from "./organization";

export const organizationRelations = defineRelationsPart({ organization, member, invitation }, (r) => ({
  organization: {
    members: r.many.member({ from: r.organization.id, to: r.member.organizationId }),
    invitations: r.many.invitation({ from: r.organization.id, to: r.invitation.organizationId }),
  },
}));
