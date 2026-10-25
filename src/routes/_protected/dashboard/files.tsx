import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FolderIcon, UploadIcon } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { listFilesFn } from "@/apps/storage/functions/list-files";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { useUploadFile } from "@/lib/s3/use-upload-file";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_protected/dashboard/files")({
  loader: () => listFilesFn(),
  component: FilesPage,
});

function FilesPage() {
  const files = Route.useLoaderData();
  const router = useRouter();
  const { progress, setProgress, upload } = useUploadFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      const { ok } = await upload("teacher-audio", file);
      if (!ok) {
        throw new Error();
      }
      await router.invalidate();
    } catch {
      setError(m.dashboard_file_upload_error());
    }
    setProgress(null);
  };

  return (
    <Card>
      <CardPanel className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-base">{m.dashboard_files_title()}</span>
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={uploadFile} />
          <Button
            variant="outline"
            loading={progress !== null}
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <UploadIcon />
            {m.dashboard_upload_file()}
          </Button>
        </div>
        {progress !== null ? <Progress value={progress * 100} /> : null}
        {error ? <span className="text-sm text-destructive-foreground">{error}</span> : null}
        {files.length ? null : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderIcon />
              </EmptyMedia>
              <EmptyTitle>{m.dashboard_no_files_title()}</EmptyTitle>
              <EmptyDescription>{m.dashboard_no_files_description()}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {files.map((file) => {
          return file.filename;
        })}
      </CardPanel>
    </Card>
  );
}
