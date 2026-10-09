import { sendEmail } from "@/apps/notifications/services/send-email";
import { m } from "@/paraglide/messages";

type SendVerificationOtpT = { email: string; otp: string; type: string };

export const sendVerificationOTP = async ({ email, otp, type }: SendVerificationOtpT) => {
  if (type !== "sign-in") {
    return;
  }
  if (!import.meta.env.PROD) {
    console.log(`[auth] OTP for ${email}: ${otp}`);
    return;
  }
  void sendEmail({
    to: email,
    subject: m.otp_email_subject({ otp }),
    html: m.otp_email_html({ otp }),
    text: m.otp_email_text({ otp }),
  });
};
