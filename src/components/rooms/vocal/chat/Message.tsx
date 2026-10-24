import { useParticipants } from "@livekit/components-react";
import { motion } from "motion/react";
import { memo } from "react";
import type { ChatMessageT } from "@/apps/rooms/shared/types";
import { AudioMessage } from "./AudioMessage";
import { TextMessage } from "./TextMessage";

type MessageT = { message: ChatMessageT; previousMessage?: ChatMessageT | null };

export const Message = memo(({ message, previousMessage }: MessageT) => {
  const participant = useParticipants()
    .filter((p) => p.identity === message.userId.toString())
    .at(0);
  const fromSameParticipant = previousMessage?.userId === message.userId;

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
        <span className={participant?.isLocal ? "text-green-500" : "text-blue-500"}>
          {fromSameParticipant ? null : participant?.name}
        </span>
        <div className="w-full">
          {message.kind === "audio" ? (
            <AudioMessage payload={message.payload} />
          ) : (
            <TextMessage payload={message.payload} />
          )}
        </div>
      </div>
    </motion.div>
  );
});
Message.displayName = "Message";
