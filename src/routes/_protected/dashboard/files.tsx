import { ClientOnly, createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckIcon, FolderIcon, PencilIcon, UploadIcon, XIcon, ZapIcon } from "lucide-react";
import { useRef, useState } from "react";
import { listFilesFn } from "@/apps/storage/functions/list-files";
import { renameFileFn } from "@/apps/storage/functions/rename-file";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toastManager } from "@/components/ui/toast";
import { useUploadFile } from "@/lib/s3/use-upload-file";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_protected/dashboard/files")({
  loader: () => listFilesFn(),
  component: FilesPage,
});

function FilesPage() {
  const files = Route.useLoaderData();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const { progress, upload } = useUploadFile({
    kind: "teacher-audio",
    onSuccess: () => {
      setError("");
      return router.invalidate();
    },
    onError: () => setError(m.dashboard_file_upload_error()),
  });

  return (
    <Card>
      <CardPanel className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-base">{m.dashboard_files_title()}</span>
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={upload} />
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
        {files.map((file) => (
          <FileRow key={file.id} fileId={file.id} filename={file.filename} url={file.url} createdAt={file.createdAt} />
        ))}
      </CardPanel>
    </Card>
  );
}

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

type FileRowT = { fileId: number; filename: string; url: string; createdAt: Date };

function FileRow({ fileId, filename, url, createdAt }: FileRowT) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(filename);
  const renameFile = useServerFn(renameFileFn);

  const cancel = () => {
    setName(filename);
    setEditing(false);
  };

  const save = async () => {
    try {
      await renameFile({ data: { fileId, filename: name } });
      toastManager.add({
        type: "success",
        id: `file-rename-success-${fileId}`,
        title: "File renamed",
      });
    } catch {
      toastManager.add({
        type: "error",
        id: `file-rename-error-{fileId}`,
        title: "Could not rename file",
      });
    }
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-1">
      {editing ? (
        <div className="flex items-center gap-2">
          <Input
            size="sm"
            value={name}
            autoFocus
            aria-label={m.dashboard_rename_file()}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
          />
          <Button size="icon-sm" variant="ghost" aria-label={m.dashboard_save()} onClick={save}>
            <CheckIcon />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label={m.cancel()} onClick={cancel}>
            <XIcon />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span className="truncate text-sm">{name}</span>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={m.dashboard_rename_file()}
            title={m.dashboard_rename_file()}
            onClick={() => setEditing(true)}
          >
            <PencilIcon />
          </Button>
          <span className="ml-auto shrink-0 text-muted-foreground text-xs">
            <ClientOnly>{dateFormat.format(new Date(createdAt))}</ClientOnly>
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <AudioPlayer url={url} />
        </div>
        <Button
          variant="outline"
          aria-label="Mock action"
          title="Mock action"
          onClick={() =>
            toastManager.add({ type: "info", id: `file-mock-action-${fileId}`, title: `Mock action: ${name}` })
          }
        >
          Выбрать
        </Button>
      </div>
    </div>
  );
}
