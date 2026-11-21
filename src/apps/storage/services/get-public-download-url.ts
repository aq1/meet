import { env } from "@/env";

export const getPublicDownloadUrl = ({ bucket, key }: { bucket: string; key: string }) => {
  return `${env.S3_ENDPOINT}/${bucket}/${key}`;
};
