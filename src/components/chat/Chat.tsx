import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/lib/user-store";
import { AnimatePresence, motion } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLivekit, type Message } from "../rooms/vocal/room-state";
import { RoomEvent } from "livekit-client";

type MessageT = {
  id: string;
  my: boolean;
  text: string;
  sender: string;
  date: string;
};
const Message = ({
  message,
  previousMessage,
}: {
  previousMessage?: MessageT | null;
  message: MessageT;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap text-sm"
    >
      <span className={message.my ? "text-green-500" : "text-blue-500"}>
        {previousMessage?.my !== message.my ? message.sender : null}
      </span>
      <span>{message.text}</span>
    </motion.div>
  );
};

const decoder = new TextDecoder();

export const Chat = () => {
  const [messages, setMessages] = useState<MessageT[]>([]);
  const [draft, setDraft] = useState("");
  const username = useUser((state) => state.username);
  const bottomRef = useRef<HTMLDivElement>(null);
  const livekit = useLivekit();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    const handleIncomingChat = (payload: Uint8Array) => {
      const msg: Message = JSON.parse(decoder.decode(payload));
      if (msg.type !== "chat") {
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `${msg.username}-${Date.now()}`,
          sender: msg.username,
          text: msg.text,
          my: false,
          date: new Date().toISOString(),
        },
      ]);
    };

    livekit.room.on(RoomEvent.DataReceived, handleIncomingChat);
    return () => {
      livekit.room.off(RoomEvent.DataReceived, handleIncomingChat);
    };
  }, [messages.length]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    livekit.sendChat(username, text);

    setMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        sender: username || "Me",
        my: true,
        text,
        date: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="size-full">
      <div className="size-full flex flex-col justify-between align-center">
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col">
            <AnimatePresence initial={false}>
              {messages.map((m, index) => (
                <Message
                  key={m.id}
                  previousMessage={index ? messages.at(index - 1) : null}
                  message={m}
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
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};
