import { useChat, useRoomContext } from "@livekit/components-react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpIcon, Paperclip, Send } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { presignChatUploadServerFn } from "@/apps/rooms/functions/presign-chat-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { putWithProgress } from "@/lib/s3/put-with-progress";
import { m } from "@/paraglide/messages";
import { useRoomToken } from "../room-token";
import { AudioSyncBridge } from "./AudioSyncBridge";
import { Message } from "./Message";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  getComposerText,
  type ComposerValue,
} from "@/components/ui/composer";

type ChatT = {
  readonly?: boolean;
};

export const Chat = ({ readonly = false }: ChatT) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { chatMessages, send, isSending } = useChat();
  const room = useRoomContext();
  const token = useRoomToken();
  const presignUpload = useServerFn(presignChatUploadServerFn);

  const [value, setValue] = useState<ComposerValue>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const messageCount = chatMessages.length;
  useEffect(() => {
    if (messageCount) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messageCount]);

  const sendDraft = () => {
    if (!value.length) {
      return;
    }
    send(getComposerText(value));

    setValue([]);
  };

  const uploadFile = async (file: File) => {
    setUploadProgress(0);
    try {
      const { url } = await presignUpload({
        data: { roomId: room.name, token, name: file.name, type: file.type, size: file.size },
      });
      await putWithProgress(url, file, setUploadProgress);
      send(`audio:${url}`);
    } catch {
    } finally {
      setUploadProgress(null);
    }
  };

  return (
    <div className="size-full">
      <AudioSyncBridge />
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
            <Composer
              className="w-full min-w-80"
              layout="adaptive"
              submitDisabled={isSending}
              value={value}
              onValueChange={setValue}
              onSubmit={sendDraft}
            >
              <ComposerInput aria-label={m.chat_label()} placeholder={m.chat_placeholder()} />
              <ComposerActions>
                <ComposerActionGroup>
                  <Button
                    variant="outline"
                    disabled={uploadProgress !== null}
                    onClick={() => fileInputRef.current?.click()}
                    title={m.chat_attach_file()}
                  >
                    {uploadProgress === null ? <Paperclip /> : `${Math.round(uploadProgress * 100)}%`}
                  </Button>
                </ComposerActionGroup>
                <ComposerActionGroup align="end">
                  <ComposerSubmit
                    render={
                      <Button aria-label={m.chat_send_message()} size="icon">
                        <ArrowUpIcon aria-hidden="true" />
                      </Button>
                    }
                  />
                </ComposerActionGroup>
              </ComposerActions>
            </Composer>
          </div>
        )}
      </div>
    </div>
  );
};
