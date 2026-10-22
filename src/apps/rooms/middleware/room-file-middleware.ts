import { createMiddleware } from "@tanstack/react-start";
import { s3KeyFromLocation } from "@/apps/storage/services/presign-download";
import { activeRoomParticipantMiddleware } from "./active-room-participant-middleware";

export const roomFileMiddleware = createMiddleware({ type: "function" })
  .middleware([activeRoomParticipantMiddleware])
  .validator((data: { roomId: string; url: string }) => data)
  .server(async ({ next, data }) => {
    const key = s3KeyFromLocation(data.url);
    if (!key.startsWith(`${data.roomId}/files/`) || key.split("/").includes("..")) {
      throw new Response("Forbidden", { status: 403 });
    }
    return next();
  });
