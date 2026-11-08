import { index, integer, pgEnum, snakeCase, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/apps/auth/models/user";
import { baseColumns } from "@/lib/db/columns";
import { INVITATION_STATUS_VALUES } from "../shared/enums";
import { organization } from "./organization";

export const invitationStatusEnum = pgEnum("invitation_status", INVITATION_STATUS_VALUES);

export const invitation = snakeCase.table(
  "organizations_invitation",
  {
    ...baseColumns,
    organizationId: integer()
      .notNull()
      .references(() => organization.id, { onDelete: "restrict" }),
    email: text().notNull(),
    role: text(),
    status: invitationStatusEnum().notNull().default("pending"),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    inviterId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);
