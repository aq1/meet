import { defineRelationsPart } from "drizzle-orm";
import { user } from "@/apps/auth/models/user";
import { member } from "./member";
import { organization } from "./organization";

export const memberRelations = defineRelationsPart({ member, organization, user }, (r) => ({
  member: {
    organization: r.one.organization({
      from: r.member.organizationId,
      to: r.organization.id,
      optional: false,
    }),
    user: r.one.user({ from: r.member.userId, to: r.user.id, optional: false }),
  },
}));
