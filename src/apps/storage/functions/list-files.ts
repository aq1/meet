import { createServerFn } from "@tanstack/react-start";
import { anyUserMiddleware } from "@/apps/auth/middleware/any-user-middleware";
import { db } from "@/lib/db/client";
import { presignFileDownload } from "../services/presign-download";

export const listFilesFn = createServerFn({ method: "GET" })
  .middleware([anyUserMiddleware])
  .handler(async ({ context }) => {
    const files = await db.query.file.findMany({
      where: { userId: context.userId, kind: "teacher-audio", status: "uploaded" },
      orderBy: { id: "desc" },
    });
    return files.map((file) => ({ ...file, url: presignFileDownload(file) }));
  });
