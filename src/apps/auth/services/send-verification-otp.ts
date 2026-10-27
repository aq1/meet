import { sendEmail } from "@/apps/notifications/services/send-email";
import { db } from "@/lib/db/client";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";

type SendVerificationOtpT = { email: string; otp: string; type: string };

export const sendVerificationOTP = async ({ email, otp, type }: SendVerificationOtpT) => {
  if (type !== "sign-in") {
    return;
  }
  if (!import.meta.env.PROD) {
    console.log(`[auth] OTP for ${email}: ${otp}`);
    return;
  }
  const existingUser = await db.query.user.findFirst({ columns: { lang: true }, where: { email } });
  const locale = existingUser?.lang ?? getLocale();
  void sendEmail({
    to: email,
    subject: m.otp_email_subject({ otp }, { locale }),
    html: m.otp_email_html({ otp }, { locale }),
    text: m.otp_email_text({ otp }, { locale }),
  });
};
