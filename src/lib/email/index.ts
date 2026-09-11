import { Resend } from "resend";
import { env } from "#/env";

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailT = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}: SendEmailT) => {
  const { data, error } = await resend.emails.send(
    { from: env.EMAIL_FROM, to, subject, html, text },
    { idempotencyKey },
  );

  if (error) {
    console.error(`resend: ${error.name}: ${error.message}`);
    return null;
  }

  return data;
};
