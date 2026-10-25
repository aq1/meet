import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { db } from "@/lib/db/client";
import { file } from "../models";

export const renameFileFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ fileId: z.number().int().positive(), filename: z.string().trim().min(1).max(255) }))
  .handler(async ({ context, data }) => {
    const [record] = await db
      .update(file)
      .set({ filename: data.filename })
      .where(and(eq(file.id, data.fileId), eq(file.userId, context.userId), eq(file.status, "uploaded")))
      .returning();

    if (!record) {
      throw new Response("File not found", { status: 404 });
    }

    return { record };
  });
