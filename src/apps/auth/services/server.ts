import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins/email-otp";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";
import { account } from "@/apps/auth/models/account";
import { session } from "@/apps/auth/models/session";
import { user } from "@/apps/auth/models/user";
import { verification } from "@/apps/auth/models/verification";
import { sendVerificationOTP } from "@/apps/auth/services/send-verification-otp";
import { randomUserColor } from "@/apps/auth/utils/colors";
import { roomUser } from "@/apps/rooms/models/room-user";
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
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await db
          .update(roomUser)
          .set({ userId: Number(newUser.user.id) })
          .where(eq(roomUser.userId, Number(anonymousUser.user.id)));
      },
    }),
    tanstackStartCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
