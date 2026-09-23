import { sendEmail } from "#/lib/email/send-email";

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
    subject: `${otp} is your Meet sign-in code`,
    html: `<p>Your sign-in code is <strong style="font-size:1.5em;letter-spacing:0.1em">${otp}</strong>.</p><p>It expires in 10 minutes. If you did not request it, ignore this email.</p>`,
    text: `Your sign-in code is ${otp}. It expires in 10 minutes.`,
  });
};
