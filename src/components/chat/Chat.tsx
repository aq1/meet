import { type ReceivedChatMessage, useChat } from "@livekit/components-react";
import { Send, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useRef, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPortal,
  DialogPrimitive,
  DialogTitle,
} from "#/components/ui/dialog";
import { useIsTablet } from "#/hooks/use-media-query";
import { cn } from "#/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useControls } from "../rooms/vocal/controls/controls-state";
import { Button } from "../ui/button";

type MessageT = {
  message: ReceivedChatMessage;
  previousMessage?: ReceivedChatMessage | null;
};

const Message = memo(({ message, previousMessage }: MessageT) => {
  const time = new Date(message.timestamp).toLocaleTimeString();
  const prevTime = previousMessage
    ? new Date(previousMessage.timestamp).toLocaleTimeString()
    : null;
  const fromSameParticipant =
    previousMessage?.from?.identity === message.from?.identity;

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
        <span
          className={message.from?.isLocal ? "text-green-500" : "text-blue-500"}
        >
          {fromSameParticipant ? null : message.from?.identity}
        </span>
        <span>{message.message}</span>
      </div>
      <span className="text-xs opacity-50">
        {fromSameParticipant && time === prevTime ? null : time}
      </span>
    </motion.div>
  );
});
Message.displayName = "Message";

const ChatContent = () => {
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
      <div className="flex size-full flex-col justify-between align-center">
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {chatMessages.map((m, index) => (
                <Message
                  key={m.id}
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
          <Button disabled={isSending} onClick={sendDraft} title="Send message">
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Chat = () => {
  const isTablet = useIsTablet();
  const showChat = useControls((state) => state.showChat);
  const toggle = useControls((state) => state.toggle);

  if (!isTablet) {
    return (
      <div
        className={cn(
          "flex min-h-0 basis-1/4 justify-end gap-4",
          !showChat && "hidden",
        )}
      >
        <div className="flex size-full min-h-0 flex-col px-4">
          <ChatContent />
        </div>
      </div>
    );
  }

  return (
    <Dialog open={showChat} onOpenChange={() => toggle("showChat")}>
      <DialogPortal keepMounted>
        <DialogBackdrop />
        <DialogPrimitive.Popup
          className="fixed inset-0 z-50 flex flex-col gap-2 bg-background p-4 pt-[max(1rem,env(safe-area-inset-top))] outline-none transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
          data-slot="dialog-popup"
        >
          <div className="flex items-center justify-between">
            <DialogTitle>Chat</DialogTitle>
            <DialogClose
              aria-label="Close"
              render={<Button size="icon" variant="ghost" title="Close" />}
            >
              <XIcon />
            </DialogClose>
          </div>
          <div className="min-h-0 flex-1">
            <ChatContent />
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
};
