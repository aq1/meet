import { anonymous } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins/email-otp";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "@/env";
import { sendVerificationOTP } from "@/lib/auth/send-verification-otp";
import { db } from "@/lib/db/client";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: { database: { generateId: "serial" } },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      storeOTP: "hashed",
      sendVerificationOTP,
    }),
    anonymous({
      onLinkAccount: async () => {},
    }),
    tanstackStartCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
