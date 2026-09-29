import type { ReceivedChatMessage } from "@livekit/components-react";
import { motion } from "motion/react";
import { memo } from "react";
import { MessageContent } from "./MessageContent";

type MessageT = {
  message: ReceivedChatMessage;
  previousMessage?: ReceivedChatMessage | null;
};

export const Message = memo(({ message, previousMessage }: MessageT) => {
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
