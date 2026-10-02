import { createServerFn } from "@tanstack/react-start";
import { roomIsActive } from "@/apps/rooms/queries";
import { anyUserMiddleware } from "@/lib/auth/any-user-middleware";
import { verifyLivekitRoomToken } from "@/lib/livekit/verify-livekit-room-token";
import { presignS3Upload } from "@/lib/s3/presign-upload";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

const sanitizeFileName = (name: string) =>
  (name.split(/[\\/]/).pop() ?? "")
    .replace(/[^\w.-]/g, "_")
    .replace(/^\.+/, "")
    .slice(-100);

export const presignChatUploadServerFn = createServerFn({ method: "POST" })
  .middleware([anyUserMiddleware])
  .validator((data: { roomId: string; token: string; name: string; type: string; size: number }) => data)
  .handler(async ({ data, context }) => {
    const claims = await verifyLivekitRoomToken(data.token, data.roomId);
    if (claims?.sub !== context.session.user.id.toString()) {
      throw new Response("Forbidden", { status: 403 });
    }
    if (!data.type.startsWith("audio/")) {
      throw new Response("Unsupported file type", { status: 415 });
    }
    if (data.size > MAX_UPLOAD_SIZE) {
      throw new Response("File too large", { status: 413 });
    }
    if (!(await roomIsActive(data.roomId))) {
      throw new Response("Room not found", { status: 404 });
    }
    const key = `${data.roomId}/files/${Date.now()}${sanitizeFileName(data.name)}`;
    const url = presignS3Upload(key, data.type);
    if (!url) {
      throw new Response("Failed to presign upload", { status: 500 });
    }
    return { url, key };
  });
