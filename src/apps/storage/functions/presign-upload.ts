import { createServerFn } from "@tanstack/react-start";
import contentTypesDb from "mime-db";
import { z } from "zod";
import { authMiddleware } from "@/apps/auth/middleware/auth-middleware";
import { createUpload } from "../services/create-upload";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

const UploadBaseSchema = z.object({
  name: z.string().max(255),
  size: z.number().lte(MAX_UPLOAD_SIZE),
});

const UploadSchema = z
  .discriminatedUnion("kind", [
    UploadBaseSchema.extend({
      kind: z.literal("teacher-audio"),
      type: z.string().startsWith("audio/"),
    }),
    UploadBaseSchema.extend({
      kind: z.literal("avatar"),
      type: z.string().startsWith("image/"),
    }),
  ])
  .transform((data, ctx) => {
    const ext = contentTypesDb[data.type.split(";")[0].trim().toLowerCase()]?.extensions?.at(0);
    if (!ext) {
      ctx.addIssue({ code: "custom", path: ["type"], message: "Unknown content type" });
      return z.NEVER;
    }
    return { ...data, ext };
  });

export const presignUploadFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(UploadSchema)
  .handler(async ({ data, context }) => {
    return await createUpload({ ...data, userId: Number(context.session.user.id) });
  });
