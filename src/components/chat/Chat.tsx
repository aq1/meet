import { type ReceivedChatMessage, useChat } from "@livekit/components-react";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";

type MessageT = {
  message: ReceivedChatMessage;
  previousMessage?: ReceivedChatMessage | null;
};

const Message = ({ message, previousMessage }: MessageT) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="flex justify-between items-center text-sm"
    >
      <div className="flex flex-col">
        <span
          className={message.from?.isLocal ? "text-green-500" : "text-blue-500"}
        >
          {previousMessage?.from?.identity !== message.from?.identity
            ? message.from?.identity
            : null}
        </span>
        <span>{message.message}</span>
      </div>
      <span className="text-xs opacity-50">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </motion.div>
  );
};

export const Chat = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chatMessages, send, isSending } = useChat();

  const [draft, setDraft] = useState("");

  const sendDraft = () => {
    if (!draft.length) {
      return;
    }
    send(draft);

    setDraft("");
  };

  return (
    <div className="size-full">
      <div className="size-full flex flex-col justify-between align-center">
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {chatMessages.map((m, index) => (
                <Message
                  key={m.timestamp}
                  message={m}
                  previousMessage={index ? chatMessages.at(index - 1) : null}
                />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        <div className="flex gap-4">
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
          <Button disabled={isSending} onClick={sendDraft}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};
