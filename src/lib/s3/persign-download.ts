import { s3 } from "bun";
import { env } from "#/env";

const DOWNLOAD_URL_TTL = 7 * 24 * 60 * 60;

export const presignS3Download = (location: string, ttl?: number) => {
  const decodedPath = decodeURIComponent(new URL(location).pathname).replace(/^\/+/, "");
  const bucketPrefix = `${env.S3_BUCKET}/`;

  const path = decodedPath.startsWith(bucketPrefix) ? decodedPath.slice(bucketPrefix.length) : decodedPath;

  try {
    return s3.presign(path, {
      method: "GET",
      expiresIn: ttl ? ttl : DOWNLOAD_URL_TTL,
    });
  } catch {
    return "";
  }
};
