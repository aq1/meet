import { createServerFn } from "@tanstack/react-start";
import { and, eq, isNull } from "drizzle-orm";
import { room } from "@/apps/rooms/models/room";
import { roomTokenOwnerMiddleware } from "@/apps/rooms/services/livekit/room-token-owner-middleware";
import { presignS3Upload } from "@/apps/storage/services/presign-upload";
import { db } from "@/lib/db/client";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

const sanitizeFileName = (name: string) =>
  (name.split(/[\\/]/).pop() ?? "")
    .replace(/[^\w.-]/g, "_")
    .replace(/^\.+/, "")
    .slice(-100);

export const presignChatUploadServerFn = createServerFn({ method: "POST" })
  .middleware([roomTokenOwnerMiddleware])
  .validator((data: { roomId: string; token: string; name: string; type: string; size: number }) => data)
  .handler(async ({ data }) => {
    if (!data.type.startsWith("audio/")) {
      throw new Response("Unsupported file type", { status: 415 });
    }
    if (data.size > MAX_UPLOAD_SIZE) {
      throw new Response("File too large", { status: 413 });
    }
    const [activeRoom] = await db
      .select({ id: room.id })
      .from(room)
      .where(and(eq(room.publicId, data.roomId), isNull(room.finishedAt)))
      .limit(1);
    if (!activeRoom) {
      throw new Response("Room not found", { status: 404 });
    }
    const key = `${data.roomId}/files/${Date.now()}${sanitizeFileName(data.name)}`;
    const url = presignS3Upload(key, data.type);
    if (!url) {
      throw new Response("Failed to presign upload", { status: 500 });
    }
    return { url, key };
  });
