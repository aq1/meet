import { createServerFn } from "@tanstack/react-start";
import { roomFileMiddleware } from "@/apps/rooms/services/livekit/room-file-middleware";
import { presignS3Download } from "@/apps/storage/services/presign-download";

export const presignChatDownloadServerFn = createServerFn({ method: "POST" })
  .middleware([roomFileMiddleware])
  .validator((data: { roomId: string; token: string; url: string }) => data)
  .handler(async ({ data }) => {
    const url = presignS3Download(data.url);
    if (!url) {
      throw new Response("Failed to presign download", { status: 500 });
    }
    return url;
  });
