import { createServerFn } from "@tanstack/react-start";
import { roomExists } from "#/lib/db/rooms/room-exists";
import { presignS3Upload } from "#/lib/s3/presign-upload";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

export const presignChatUploadServerFn = createServerFn({ method: "POST" })
  .validator((data: { roomId: string; name: string; type: string; size: number }) => data)
  .handler(async ({ data }) => {
    if (!data.type.startsWith("audio/")) {
      throw new Response("Unsupported file type", { status: 415 });
    }
    if (data.size > MAX_UPLOAD_SIZE) {
      throw new Response("File too large", { status: 413 });
    }
    if (!(await roomExists(data.roomId))) {
      throw new Response("Room not found", { status: 404 });
    }
    const key = `${data.roomId}/files/${Date.now()}${data.name}`;
    const url = presignS3Upload(key, data.type);
    if (!url) {
      throw new Response("Failed to presign upload", { status: 500 });
    }
    return { url, key };
  });
