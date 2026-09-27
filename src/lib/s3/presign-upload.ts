import { s3 } from "bun";

const UPLOAD_URL_TTL = 15 * 60;

export const presignS3Upload = (path: string, contentType?: string, ttl?: number) => {
  const key = path.replace(/^\/+/, "");
  if (import.meta.env.DEV) {
    return `/api/mock-s3/${key.split("/").map(encodeURIComponent).join("/")}`;
  }
  try {
    return s3.presign(key, {
      method: "PUT",
      type: contentType,
      expiresIn: ttl ? ttl : UPLOAD_URL_TTL,
    });
  } catch {
    return "";
  }
};
