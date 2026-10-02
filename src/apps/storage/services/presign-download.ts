import { s3 } from "bun";
import { env } from "@/env";

const DOWNLOAD_URL_TTL = 7 * 24 * 60 * 60;

export const s3KeyFromLocation = (location: string) => {
  const decodedPath = decodeURIComponent(new URL(location).pathname).replace(/^\/+/, "");
  const bucketPrefix = `${env.S3_BUCKET}/`;
  return decodedPath.startsWith(bucketPrefix) ? decodedPath.slice(bucketPrefix.length) : decodedPath;
};

export const presignS3Download = (location: string, ttl?: number) => {
  try {
    return s3.presign(s3KeyFromLocation(location), {
      method: "GET",
      expiresIn: ttl ? ttl : DOWNLOAD_URL_TTL,
    });
  } catch {
    return "";
  }
};
