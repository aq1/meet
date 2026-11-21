import { s3 } from "bun";
import { env } from "@/env";

const DOWNLOAD_URL_TTL = 24 * 60 * 60;

export const presignRecordingDownload = (location: string, ttl?: number) => {
  try {
    return s3.presign(location, {
      method: "GET",
      expiresIn: ttl ? ttl : DOWNLOAD_URL_TTL,
      bucket: env.S3_RECORDINGS_BUCKET,
    });
  } catch {
    return "";
  }
};
