import { sendEmail } from "#/lib/email";

const to = process.argv[2] ?? "delivered@resend.dev";


const data = await sendEmail({
  to,
  subject: "Meet test email",
  html: "<p>Test email from <strong>meet</strong>.</p>",
  idempotencyKey: `test-email/${Date.now()}`,
});

if (!data) process.exit(1);

console.log(to);
