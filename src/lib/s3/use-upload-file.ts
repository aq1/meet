import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { completeUploadFn } from "@/apps/storage/functions/complete-upload";
import { presignUploadFn } from "@/apps/storage/functions/presign-upload";
import type { UploadKindT } from "@/apps/storage/shared/types";

export const useUploadFile = () => {
  const [progress, setProgress] = useState<number | null>(null);
  const presignUpload = useServerFn(presignUploadFn);
  const completeUpload = useServerFn(completeUploadFn);

  const putWithProgress = (url: string, file: File) =>
    new Promise<boolean>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(e.loaded / e.total);
        }
      };
      xhr.onload = () => {
        resolve(xhr.status < 300);
      };
      xhr.onerror = () => resolve(false);
      xhr.send(file);
    });

  const upload = async (kind: UploadKindT, file: File) => {
    const result = await presignUpload({
      data: { kind, name: file.name, size: file.size, type: file.type },
    });
    if (!(await putWithProgress(result.url, file))) {
      return { ...result, ok: false };
    }
    const record = await completeUpload({ data: { fileId: result.record.id } }).catch(() => null);
    return { ...result, ok: !!record, record: record ?? result.record };
  };

  return { progress, setProgress, upload };
};
