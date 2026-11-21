import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { db } from "@/lib/db/client";
import { getPublicDownloadUrl } from "../services/get-public-download-url";

export const listFilesFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const files = await db.query.file.findMany({
      where: { userId: context.userId, kind: "teacher-audio", status: "uploaded" },
      orderBy: { id: "desc" },
    });
    return files.map((file) => ({ ...file, url: getPublicDownloadUrl(file) }));
  });
