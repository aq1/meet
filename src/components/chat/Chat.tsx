import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useUser } from "@/lib/user-store";
import { AnimatePresence, motion } from "motion/react";

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
      <span className="text-blue-500">
        {previousMessage?.my !== message.my ? message.sender : null}
      </span>
      <span>{message.text}</span>
    </motion.div>
  );
};

export const Chat = () => {
  const [messages, setMessages] = useState<MessageT[]>([
    {
      id: "msg_001",
      sender: "Teacher",
      my: false,
      text: "Hey, are we still on for the 3pm sync?",
      date: "2026-06-06T14:42:13Z",
    },
    {
      id: "msg_002",
      sender: "Student",
      my: true,
      text: "Yep, dialing in now. Pushed the latest changes to the branch.",
      date: "2026-06-06T14:43:01Z",
    },
    {
      id: "msg_003",
      sender: "Teacher",
      my: false,
      text: "Check this out",
      date: "2026-06-06T14:45:30Z",
    },
    {
      id: "msg_004",
      sender: "Teacher",
      my: false,
      text: "Nice work. Editing the doc now.",
      date: "2026-06-06T14:46:12Z",
    },
    {
      id: "msg_005",
      sender: "Student",
      my: true,
      text: "Let me know when it's ready for review.",
      date: "2026-06-06T14:48:05Z",
    },
    {
      id: "msg_006",
      sender: "Teacher",
      my: false,
      text: "Almost done, give me five minutes.",
      date: "2026-06-06T14:49:33Z",
    },
    {
      id: "msg_007",
      sender: "Teacher",
      my: false,
      text: "Sounds good, no rush.",
      date: "2026-06-06T14:50:10Z",
    },
    {
      id: "msg_008",
      sender: "Student",
      my: true,
      text: "Did anyone update the changelog?",
      date: "2026-06-06T14:52:47Z",
    },
    {
      id: "msg_009",
      sender: "Teacher",
      my: false,
      text: "I'll handle the changelog after the doc.",
      date: "2026-06-06T14:53:20Z",
    },
    {
      id: "msg_010",
      sender: "Teacher",
      my: false,
      text: "Perfect. Thanks both!",
      date: "2026-06-06T14:54:02Z",
    },
  ]);
  const [draft, setDraft] = useState("");
  const username = useUser((state) => state.username);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
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
        </div>
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
