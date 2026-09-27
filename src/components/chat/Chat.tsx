import { type ReceivedChatMessage, useChat, useRoomContext } from "@livekit/components-react";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Plus, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import { roomExists } from "#/lib/db/rooms/room-exists";
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

type MessageT = {
  message: ReceivedChatMessage;
  previousMessage?: ReceivedChatMessage | null;
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
      className="flex items-center justify-between text-sm"
    >
      <div className="flex flex-col">
        <span className={message.from?.isLocal ? "text-green-500" : "text-blue-500"}>
          {fromSameParticipant ? null : message.from?.name}
        </span>
        <span>{message.message}</span>
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
