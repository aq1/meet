import { s3 } from "bun";

const UPLOAD_URL_TTL = 15 * 60;

export const presignS3Upload = (path: string, contentType?: string, ttl?: number, bucket?: string) => {
  const key = path.replace(/^\/+/, "");
  try {
    return s3.presign(key, {
      method: "PUT",
      type: contentType,
      expiresIn: ttl ? ttl : UPLOAD_URL_TTL,
      bucket,
    });
  } catch {
    return "";
  }
};
