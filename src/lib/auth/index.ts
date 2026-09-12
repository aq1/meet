import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins/email-otp";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "#/env";
import { db } from "#/lib/db";
import { sendEmail } from "#/lib/email";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: { db, type: "postgres" },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      storeOTP: "hashed",
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type !== "sign-in") {
          return;
        }
        if (!import.meta.env.PROD) {
          console.log(`[auth] OTP for ${email}: ${otp}`);
          return;
        }
        void sendEmail({
          to: email,
          subject: `${otp} is your Meet sign-in code`,
          html: `<p>Your sign-in code is <strong style="font-size:1.5em;letter-spacing:0.1em">${otp}</strong>.</p><p>It expires in 10 minutes. If you did not request it, ignore this email.</p>`,
          text: `Your sign-in code is ${otp}. It expires in 10 minutes.`,
        });
      },
    }),
    tanstackStartCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
