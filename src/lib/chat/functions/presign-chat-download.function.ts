import { createServerFn } from "@tanstack/react-start";
import { presignS3Download } from "#/lib/s3/presign-download";

export const presignChatDownloadServerFn = createServerFn({ method: "POST" })
  .validator((data: { roomId: string; url: string }) => data)
  .handler(({ data }) => {
    const path = decodeURIComponent(new URL(data.url).pathname);
    if (!path.includes(`/${data.roomId}/files/`)) {
      throw new Response("Forbidden", { status: 403 });
    }
    const url = presignS3Download(data.url);
    if (!url) {
      throw new Response("Failed to presign download", { status: 500 });
    }
    return url;
  });
