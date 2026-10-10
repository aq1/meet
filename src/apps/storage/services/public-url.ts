import { env } from "@/env";

export const publicS3Url = (key: string) => {
  const path = key.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
  const base = env.S3_PUBLIC_URL ?? `${env.S3_ENDPOINT.replace(/\/+$/, "")}/${env.S3_PUBLIC_BUCKET}`;
  return `${base.replace(/\/+$/, "")}/${path}`;
};
