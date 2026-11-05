import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { admin, anonymous, organization } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins/email-otp";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { account } from "@/apps/auth/models/account";
import { session } from "@/apps/auth/models/session";
import { user } from "@/apps/auth/models/user";
import { verification } from "@/apps/auth/models/verification";
import { sendVerificationOTP } from "@/apps/auth/services/send-verification-otp";
import { randomUserColor } from "@/apps/auth/utils/colors";
import { invitation } from "@/apps/organizations/models/invitation";
import { member } from "@/apps/organizations/models/member";
import { organization as organizationModel } from "@/apps/organizations/models/organization";
import { env } from "@/env";
import { db } from "@/lib/db/client";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      auth_user: user,
      auth_session: session,
      auth_account: account,
      auth_verification: verification,
      organizations_organization: organizationModel,
      organizations_member: member,
      organizations_invitation: invitation,
    },
  }),
  user: {
    modelName: "auth_user",
    additionalFields: {
      color: { type: "string", required: false, defaultValue: randomUserColor },
      lang: { type: ["en", "ru"], required: false, defaultValue: "ru" },
    },
  },
  session: { modelName: "auth_session" },
  account: { modelName: "auth_account" },
  verification: { modelName: "auth_verification" },
  advanced: { database: { generateId: "serial" } },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      storeOTP: "hashed",
      sendVerificationOTP,
    }),
    anonymous(),
    admin({
      adminUserIds: env.ADMIN_USER_IDS,
    }),
    organization({
      schema: {
        organization: { modelName: "organizations_organization" },
        member: { modelName: "organizations_member" },
        invitation: { modelName: "organizations_invitation" },
      },
    }),
    tanstackStartCookies(),
  ],
});
