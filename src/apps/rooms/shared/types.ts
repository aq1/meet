import type { z } from "zod";
import type { MessageSchema } from "./schemas";

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

export type ChatMessageT = z.output<typeof MessageSchema>;
