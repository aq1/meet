ALTER TABLE "rooms_chat_message" ADD COLUMN "text" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms_chat_message" DROP COLUMN "payload";