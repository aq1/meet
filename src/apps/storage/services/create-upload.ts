import { s3 } from "bun";
import { env } from "@/env";
import { db } from "@/lib/db/client";
import { file } from "../models";
import type { FileKindT } from "../shared/enums";

type CreateUploadT = { kind: FileKindT; ext: string; userId: number; name: string; size: number; type: string };

export const createUpload = async (data: CreateUploadT) => {
  const key = `${data.kind}/${crypto.randomUUID()}.${data.ext}`;
  const bucket = env.S3_UPLOADS_BUCKET;
  const [record] = await db
    .insert(file)
    .values({
      userId: data.userId,
      filename: data.name,
      size: data.size,
      contentType: data.type,
      kind: data.kind,
      key,
      bucket,
    })
    .returning();

  const url = s3.presign(key, {
    method: "PUT",
    type: data.type,
    bucket: bucket,
    expiresIn: 15 * 60,
  });

  return { url, record, publicUrl: `${env.S3_ENDPOINT}/${record.bucket}/${record.key}` };
};
