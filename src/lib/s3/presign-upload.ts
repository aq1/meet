import { s3 } from "bun";

const UPLOAD_URL_TTL = 15 * 60;

export const presignS3Upload = (path: string, contentType?: string, ttl?: number) => {
  try {
    return s3.presign(path.replace(/^\/+/, ""), {
      method: "PUT",
      type: contentType,
      expiresIn: ttl ? ttl : UPLOAD_URL_TTL,
    });
  } catch {
    return "";
  }
};
