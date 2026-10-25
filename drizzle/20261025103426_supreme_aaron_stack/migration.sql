CREATE TYPE "fileKind" AS ENUM('teacher-audio', 'avatar');--> statement-breakpoint
ALTER TABLE "storage_file" ADD COLUMN "kind" "fileKind";