import { useServerFn } from "@tanstack/react-start";
import { type ChangeEvent, useState } from "react";
import { completeUploadFn } from "@/apps/storage/functions/complete-upload";
import { presignUploadFn } from "@/apps/storage/functions/presign-upload";
import type { UploadKindT } from "@/apps/storage/shared/types";

type UploadResultT = Awaited<ReturnType<typeof presignUploadFn>>;

type UseUploadFileT = {
  kind: UploadKindT;
  onSuccess?: (result: UploadResultT) => unknown;
  onError?: () => unknown;
};

export const useUploadFile = ({ kind, onSuccess, onError }: UseUploadFileT) => {
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

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setProgress(0);
    try {
      const result = await presignUpload({
        data: { kind, name: file.name, size: file.size, type: file.type },
      });
      if (!(await putWithProgress(result.url, file))) {
        throw new Error();
      }
      const record = await completeUpload({ data: { fileId: result.record.id } });
      await onSuccess?.({ ...result, record });
    } catch {
      await onError?.();
    } finally {
      setProgress(null);
    }
  };

  return { progress, upload };
};
