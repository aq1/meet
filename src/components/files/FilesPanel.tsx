import { ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckIcon, ChevronRight, FolderIcon, PencilIcon, SearchIcon, UploadIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { listFilesFn } from "@/apps/storage/functions/list-files";
import { renameFileFn } from "@/apps/storage/functions/rename-file";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toastManager } from "@/components/ui/toast";
import { useUploadFile } from "@/lib/s3/use-upload-file";
import { m } from "@/paraglide/messages";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Separator } from "../ui/separator";

type FilesPanelProps = {
  files: Awaited<ReturnType<typeof listFilesFn>>;
  onFilesChange: () => unknown;
  onSelect?: (fileId: number) => unknown;
};

export function FilesPanel({ files, onFilesChange, onSelect }: FilesPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const query = filter.trim().toLocaleLowerCase();
  const filteredFiles = query ? files.filter((file) => file.filename.toLocaleLowerCase().includes(query)) : files;
  const { progress, upload } = useUploadFile({
    kind: "teacher-audio",
    onSuccess: () => {
      setError("");
      return onFilesChange();
    },
    onError: () => setError(m.dashboard_file_upload_error()),
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
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
      <Separator />
      <ScrollArea scrollFade className="min-h-0 flex-1 pt-4">
        <div className="flex flex-col gap-4">
          {files.length > 3 ? (
            <InputGroup>
              <InputGroupInput
                aria-label={m.files_search_label()}
                placeholder={m.files_search_placeholder()}
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup>
          ) : null}
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
          <AnimatePresence initial={false} mode="popLayout">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <FileRow
                  fileId={file.id}
                  filename={file.filename}
                  url={file.url}
                  createdAt={file.createdAt}
                  onSelect={onSelect}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

type FileRowT = {
  fileId: number;
  filename: string;
  url: string;
  createdAt: Date;
  onSelect?: (fileId: number) => unknown;
};

function FileRow({ fileId, filename, url, createdAt, onSelect }: FileRowT) {
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
        title: m.files_rename_success(),
      });
    } catch {
      toastManager.add({
        type: "error",
        id: `file-rename-error-${fileId}`,
        title: m.files_rename_error(),
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
        {onSelect ? (
          <Button variant="outline" onClick={() => onSelect(fileId)}>
            {m.files_select()}
            <ChevronRight />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
