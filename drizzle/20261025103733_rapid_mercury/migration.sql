CREATE TYPE "file_status" AS ENUM('created', 'uploaded');--> statement-breakpoint
ALTER TYPE "fileKind" RENAME TO "file_kind";--> statement-breakpoint
ALTER TABLE "storage_file" ADD COLUMN "status" "file_status" DEFAULT 'created'::"file_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "storage_file" ALTER COLUMN "kind" SET NOT NULL;