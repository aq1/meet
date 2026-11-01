ALTER TABLE "auth_session" ADD COLUMN "impersonated_by" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "ban_reason" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "ban_expires" timestamp(6) with time zone;--> statement-breakpoint
ALTER TABLE "auth_user" ALTER COLUMN "is_anonymous" SET NOT NULL;