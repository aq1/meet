import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins/email-otp";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { account } from "@/apps/auth/models/account";
import { session } from "@/apps/auth/models/session";
import { user } from "@/apps/auth/models/user";
import { verification } from "@/apps/auth/models/verification";
import { reassignRoomUsers } from "@/apps/rooms/queries";
import { env } from "@/env";
import { sendVerificationOTP } from "@/lib/auth/send-verification-otp";
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
    },
  }),
  user: { modelName: "auth_user" },
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
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await reassignRoomUsers(Number(anonymousUser.user.id), Number(newUser.user.id));
      },
    }),
    tanstackStartCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
