import { createMiddleware } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { db } from "@/lib/db/client";

export const pendingUploadOwnerMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .validator(z.looseObject({ fileId: z.number().int().positive() }))
  .server(async ({ next, data, context }) => {
    const record = await db.query.file.findFirst({
      where: { id: data.fileId, userId: context.userId, status: "created" },
    });

    if (!record) {
      throw new Response("File not found", { status: 404 });
    }

    return next({ context: { file: record } });
  });
