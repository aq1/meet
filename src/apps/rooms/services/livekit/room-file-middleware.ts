import { createMiddleware } from "@tanstack/react-start";
import { roomTokenMiddleware } from "@/apps/rooms/services/livekit/room-token-middleware";
import { s3KeyFromLocation } from "@/apps/storage/services/presign-download";

export const roomFileMiddleware = createMiddleware({ type: "function" })
  .middleware([roomTokenMiddleware])
  .validator((data: { roomId: string; url: string }) => data)
  .server(async ({ next, data }) => {
    const key = s3KeyFromLocation(data.url);
    if (!key.startsWith(`${data.roomId}/files/`) || key.split("/").includes("..")) {
      throw new Response("Forbidden", { status: 403 });
    }
    return next();
  });
