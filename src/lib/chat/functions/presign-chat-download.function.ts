import { createServerFn } from "@tanstack/react-start";
import { publicMiddleware } from "@/lib/auth/public-middleware";
import { verifyLivekitRoomToken } from "@/lib/livekit/verify-livekit-room-token";
import { presignS3Download, s3KeyFromLocation } from "@/lib/s3/presign-download";

export const presignChatDownloadServerFn = createServerFn({ method: "POST" })
  .middleware([publicMiddleware])
  .validator((data: { roomId: string; token: string; url: string }) => data)
  .handler(async ({ data }) => {
    if (!(await verifyLivekitRoomToken(data.token, data.roomId))) {
      throw new Response("Forbidden", { status: 403 });
    }
    const key = s3KeyFromLocation(data.url);
    if (!key.startsWith(`${data.roomId}/files/`) || key.split("/").includes("..")) {
      throw new Response("Forbidden", { status: 403 });
    }
    const url = presignS3Download(data.url);
    if (!url) {
      throw new Response("Failed to presign download", { status: 500 });
    }
    return url;
  });
