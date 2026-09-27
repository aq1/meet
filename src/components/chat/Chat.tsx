import { type ReceivedChatMessage, useChat, useRoomContext } from "@livekit/components-react";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Pause, Play, Plus, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { roomExists } from "#/lib/db/rooms/room-exists";
import { presignS3Download } from "#/lib/s3/presign-download";
import { presignS3Upload } from "#/lib/s3/presign-upload";
import { putWithProgress } from "#/lib/s3/put-with-progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

const presignChatUpload = createServerFn({ method: "POST" })
  .validator((data: { roomId: string; name: string; type: string; size: number }) => data)
  .handler(async ({ data }) => {
    if (!data.type.startsWith("audio/")) {
      throw new Response("Unsupported file type", { status: 415 });
    }
    if (data.size > MAX_UPLOAD_SIZE) {
      throw new Response("File too large", { status: 413 });
    }
    if (!(await roomExists(data.roomId))) {
      throw new Response("Room not found", { status: 404 });
    }
    const key = `${data.roomId}/files/${Date.now()}${data.name}`;
    const url = presignS3Upload(key, data.type);
    if (!url) {
      throw new Response("Failed to presign upload", { status: 500 });
    }
    return { url, key };
  });

const presignChatDownload = createServerFn({ method: "POST" })
  .validator((data: { roomId: string; url: string }) => data)
  .handler(({ data }) => {
    const path = decodeURIComponent(new URL(data.url).pathname);
    if (!path.includes(`/${data.roomId}/files/`)) {
      throw new Response("Forbidden", { status: 403 });
    }
    const url = presignS3Download(data.url);
    if (!url) {
      throw new Response("Failed to presign download", { status: 500 });
    }
    return url;
  });

type MessageT = {
  message: ReceivedChatMessage;
  previousMessage?: ReceivedChatMessage | null;
};

type AudioMessageT = { url: string };

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const AudioMessage = ({ url }: AudioMessageT) => {
  const room = useRoomContext();
  const waveRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const presignDownload = useServerFn(presignChatDownload);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const container = waveRef.current;
    if (!container) {
      return;
    }
    let cancelled = false;

    const create = (src: string) => {
      if (cancelled) {
        return;
      }
      const ws = WaveSurfer.create({
        container,
        url: src,
        height: 40,
        waveColor: "rgba(148, 163, 184, 0.55)",
        progressColor: getComputedStyle(container).color,
        cursorWidth: 0,
        barWidth: 3,
        barGap: 2,
        barRadius: 3,
        normalize: true,
        dragToSeek: true,
      });
      ws.on("ready", (d) => {
        setDuration(d);
        setReady(true);
      });
      ws.on("timeupdate", setCurrentTime);
      ws.on("play", () => setPlaying(true));
      ws.on("pause", () => setPlaying(false));
      ws.on("finish", () => setPlaying(false));
      ws.on("interaction", () => ws.play());
      wsRef.current = ws;
    };

    if (import.meta.env.DEV) {
      create(url);
    } else {
      presignDownload({ data: { roomId: room.name, url } })
        .then(create)
        .catch(() => {});
    }

    return () => {
      cancelled = true;
      wsRef.current?.destroy();
      wsRef.current = null;
    };
  }, [presignDownload, room.name, url]);

  return (
    <div className="flex w-full items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2">
      <Button
        type="button"
        size="icon"
        className="size-9 shrink-0 rounded-full"
        disabled={!ready}
        onClick={() => wsRef.current?.playPause()}
      >
        {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
      </Button>
      <div className="relative min-w-0 flex-1">
        <div ref={waveRef} className="w-full cursor-pointer text-primary" />
        {!ready && <div className="absolute inset-0 animate-pulse rounded-md bg-muted" />}
      </div>
      <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {formatTime(playing || currentTime > 0 ? currentTime : duration)}
      </span>
    </div>
  );
};

type MessageContentT = {
  message: ReceivedChatMessage;
};

const MessageContent = ({ message }: MessageContentT) => {
  if (import.meta.env.DEV) {
    if (message.message.startsWith("/api/mock-s3")) {
      return <AudioMessage url={message.message} />;
    }
  }
  if (import.meta.env.PROD) {
    if (message.message.startsWith("https://s3.snek.sh")) {
      return <AudioMessage url={message.message} />;
    }
  }
  return message.message;
};

const Message = memo(({ message, previousMessage }: MessageT) => {
  const time = new Date(message.timestamp).toLocaleTimeString();
  const prevTime = previousMessage ? new Date(previousMessage.timestamp).toLocaleTimeString() : null;
  const fromSameParticipant = previousMessage?.from?.identity === message.from?.identity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between gap-2 text-sm"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className={message.from?.isLocal ? "text-green-500" : "text-blue-500"}>
          {fromSameParticipant ? null : message.from?.name}
        </span>
        <div className="w-full">
          <MessageContent message={message} />
        </div>
      </div>
      <span className="text-xs opacity-50">{fromSameParticipant && time === prevTime ? null : time}</span>
    </motion.div>
  );
});
Message.displayName = "Message";

type ChatT = {
  readonly?: boolean;
};

export const Chat = ({ readonly = false }: ChatT) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { chatMessages, send, isSending } = useChat();
  const room = useRoomContext();
  const presignUpload = useServerFn(presignChatUpload);

  const [draft, setDraft] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const messageCount = chatMessages.length;
  useEffect(() => {
    if (messageCount) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messageCount]);

  const sendDraft = () => {
    if (!draft.length) {
      return;
    }
    send(draft);

    setDraft("");
  };

  const uploadFile = async (file: File) => {
    setUploadProgress(0);
    try {
      const { url } = await presignUpload({
        data: { roomId: room.name, name: file.name, type: file.type, size: file.size },
      });
      await putWithProgress(url, file, setUploadProgress);
      send(url);
    } catch {
    } finally {
      setUploadProgress(null);
    }
  };

  return (
    <div className="size-full">
      <div className="flex size-full flex-col justify-between align-center">
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {chatMessages.map((m, index) => (
                <Message key={m.id} message={m} previousMessage={index ? chatMessages.at(index - 1) : null} />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        {readonly ? null : (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              id="file-select"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = "";
                if (file) {
                  uploadFile(file);
                }
              }}
            />
            <Button
              variant="outline"
              disabled={uploadProgress !== null}
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
            >
              {uploadProgress === null ? <Plus /> : `${Math.round(uploadProgress * 100)}%`}
            </Button>
            <Input
              aria-label="Chat"
              placeholder="Write a message..."
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendDraft();
                }
              }}
            />
            <Button disabled={isSending} onClick={sendDraft} title="Send message">
              <Send />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
