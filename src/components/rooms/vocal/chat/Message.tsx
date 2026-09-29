import type { ReceivedChatMessage } from "@livekit/components-react";
import { motion } from "motion/react";
import { memo } from "react";
import { MessageContent } from "./MessageContent";

type MessageT = {
  message: ReceivedChatMessage;
  previousMessage?: ReceivedChatMessage | null;
};

export const Message = memo(({ message, previousMessage }: MessageT) => {
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
    </motion.div>
  );
});
Message.displayName = "Message";
