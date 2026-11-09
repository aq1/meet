import { z } from "zod";

const envArray = z.string().transform((v) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

const EnvSchema = z.object({
  LIVEKIT_URL: z.string(),
  LIVEKIT_API_KEY: z.string(),
  LIVEKIT_API_SECRET: z.string(),
  LIVEKIT_WEBHOOK_API_KEY: z.string(),
  LIVEKIT_WEBHOOK_API_SECRET: z.string(),
  EGRESS_TEMPLATE_URL: z.url().optional(),
  S3_ENDPOINT: z.url(),
  S3_BUCKET: z.string().default("meet"),
  S3_REGION: z.string(),
  S3_PUBLIC_BUCKET: z.string().default("meet-public"),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string(),
  ADMIN_USER_IDS: envArray.optional(),
  EMAIL_FROM: z.string().default("meet@snek.sh"),
  TELEGRAM_TOKEN: z.string(),
  TELEGRAM_ADMINS: envArray.optional(),
});

export const env = EnvSchema.parse(process.env);
