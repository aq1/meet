import { useChat, useRoomContext } from "@livekit/components-react";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Send } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { ScrollArea } from "#/components/ui/scroll-area";
import { presignChatUploadServerFn } from "#/lib/chat/functions/presign-chat-upload.function";
import { putWithProgress } from "#/lib/s3/put-with-progress";
import { Message } from "./Message";

type ChatT = {
  readonly?: boolean;
};

export const Chat = ({ readonly = false }: ChatT) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { chatMessages, send, isSending } = useChat();
  const room = useRoomContext();
  const presignUpload = useServerFn(presignChatUploadServerFn);

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
