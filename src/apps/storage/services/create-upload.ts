import { s3 } from "bun";
import { env } from "@/env";
import { db } from "@/lib/db/client";
import { file } from "../models";
import type { UploadKindT } from "../shared/types";

type CreateUploadT = { kind: UploadKindT; ext: string; userId: number; name: string; size: number; type: string };

const getS3FieldsForFile = (kind: UploadKindT, ext: string) => {
  const key = `${kind}/${crypto.randomUUID()}.${ext}`;
  switch (kind) {
    case "teacher-audio":
      return { key, bucket: env.S3_BUCKET };
    case "avatar":
      return { key, bucket: env.S3_PUBLIC_BUCKET };
    default:
      throw new Error("Unexpected upload kind");
  }
};

export const createUpload = async (data: CreateUploadT) => {
  const s3Fields = getS3FieldsForFile(data.kind, data.ext);

  const [record] = await db
    .insert(file)
    .values({
      userId: data.userId,
      filename: data.name,
      size: data.size,
      contentType: data.type,
      kind: data.kind,
      ...s3Fields,
    })
    .returning();

  const url = s3.presign(s3Fields.key, {
    method: "PUT",
    type: data.type,
    bucket: s3Fields.bucket,
    expiresIn: 15 * 60,
  });

  return { url, record, publicUrl: `${env.S3_ENDPOINT}/${record.bucket}/${record.key}` };
};
