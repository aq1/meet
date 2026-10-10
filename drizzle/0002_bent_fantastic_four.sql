UPDATE "auth_user" set "image" = '' where "image" is NULL;--> statement-breakpoint
CREATE TYPE "public"."lang" AS ENUM('ru', 'en');--> statement-breakpoint
ALTER TABLE "auth_user" ALTER COLUMN "image" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "auth_user" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "lang" "lang" DEFAULT 'ru' NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "color" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms_room_user" ADD CONSTRAINT "rooms_room_user_room_id_user_id_unique" UNIQUE("room_id","user_id");
