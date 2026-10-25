import { s3 } from "bun";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { file } from "../models";

type FileT = typeof file.$inferSelect;

const baseContentType = (type: string) => type.split(";")[0].trim().toLowerCase();

export const completeUpload = async (record: FileT) => {
  const options = { bucket: record.bucket };
  const stat = await s3.stat(record.key, options).catch(() => null);

  if (!stat) {
    throw new Response("Uploaded file not found", { status: 400 });
  }

  if (stat.size !== record.size || baseContentType(stat.type) !== baseContentType(record.contentType)) {
    await s3.delete(record.key, options);
    await db.delete(file).where(eq(file.id, record.id));
    throw new Response("Uploaded file does not match", { status: 400 });
  }

  const [updated] = await db.update(file).set({ status: "uploaded" }).where(eq(file.id, record.id)).returning();
  return updated;
};
