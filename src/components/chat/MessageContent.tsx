import type { ReceivedChatMessage } from "@livekit/components-react";
import { AudioMessage } from "./AudioMessage";

type MessageContentT = {
  message: ReceivedChatMessage;
};

export const MessageContent = ({ message }: MessageContentT) => {
  if (import.meta.env.DEV) {
    if (message.message.startsWith("/api/mock-s3")) {
      return <AudioMessage url={message.message} />;
    }
  }
  if (import.meta.env.PROD) {
    if (message.message.startsWith("https://s3.snek.sh")) {
      return <AudioMessage url={message.message} />;
    }
  }
  return message.message;
};
