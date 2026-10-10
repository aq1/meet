import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { presignS3Upload } from "@/apps/storage/services/presign-upload";
import { publicS3Url } from "@/apps/storage/services/public-url";
import { env } from "@/env";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const AVATAR_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const presignAvatarUploadServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { type: string; size: number }) => data)
  .handler(async ({ data, context }) => {
    const ext = AVATAR_EXTENSIONS[data.type];
    if (!ext) {
      throw new Response("Unsupported file type", { status: 415 });
    }
    if (data.size > MAX_AVATAR_SIZE) {
      throw new Response("File too large", { status: 413 });
    }
    const key = `avatars/${context.session.user.id}/${crypto.randomUUID()}.${ext}`;
    const url = presignS3Upload(key, data.type, undefined, env.S3_PUBLIC_BUCKET);
    if (!url) {
      throw new Response("Failed to presign upload", { status: 500 });
    }
    return { url, publicUrl: publicS3Url(key) };
  });
