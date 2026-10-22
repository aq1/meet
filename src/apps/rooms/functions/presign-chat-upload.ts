import { createServerFn } from "@tanstack/react-start";
import { presignS3Upload } from "@/apps/storage/services/presign-upload";
import { activeRoomParticipantMiddleware } from "../middleware/active-room-participant-middleware";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

const sanitizeFileName = (name: string) =>
  (name.split(/[\\/]/).pop() ?? "")
    .replace(/[^\w.-]/g, "_")
    .replace(/^\.+/, "")
    .slice(-100);

export const presignChatUploadServerFn = createServerFn({ method: "POST" })
  .middleware([activeRoomParticipantMiddleware])
  .validator((data: { name: string; type: string; size: number }) => data)
  .handler(async ({ data, context }) => {
    if (!data.type.startsWith("audio/")) {
      throw new Response("Unsupported file type", { status: 415 });
    }
    if (data.size > MAX_UPLOAD_SIZE) {
      throw new Response("File too large", { status: 413 });
    }
    const key = `${context.room.publicId}/files/${Date.now()}${sanitizeFileName(data.name)}`;
    const url = presignS3Upload(key, data.type);
    if (!url) {
      throw new Response("Failed to presign upload", { status: 500 });
    }
    return { url, key };
  });
