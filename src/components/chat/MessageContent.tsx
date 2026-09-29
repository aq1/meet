import type { ReceivedChatMessage } from "@livekit/components-react";
import { AudioMessage } from "./AudioMessage";

type MessageContentT = {
  message: ReceivedChatMessage;
};

export const MessageContent = ({ message }: MessageContentT) => {
  const [type, ...rest] = message.message.split(":");
  if (type === "audio" && rest.length) {
    return <AudioMessage url={rest.join(":")} />;
  }
  return message.message;
};
