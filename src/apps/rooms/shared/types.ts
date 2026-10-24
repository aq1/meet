import type { prepareChatMessage } from "../services/chat/prepare-chat-message";

type ChatMessageTextT = {
  kind: "text";
  payload: { text: string };
};

type ChatMessageAudioT = {
  kind: "audio";
  payload: {
    key: string;
    fileName: string;
  };
};

export type ChatMessagePayloadT = (ChatMessageTextT | ChatMessageAudioT)["payload"];

export type ChatMessageT = ReturnType<typeof prepareChatMessage>;
