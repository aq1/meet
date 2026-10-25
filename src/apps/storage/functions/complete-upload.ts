import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { pendingUploadOwnerMiddleware } from "../middleware/pending-upload-owner-middleware";
import { completeUpload } from "../services/complete-upload";

export const completeUploadFn = createServerFn({ method: "POST" })
  .middleware([pendingUploadOwnerMiddleware])
  .validator(z.object({ fileId: z.number().int().positive() }))
  .handler(async ({ context }) => {
    return await completeUpload(context.file);
  });
