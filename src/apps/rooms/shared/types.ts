type ChatMessageTextT = {
  kind: "text";
  payload: { text: string };
};

type ChatMessageAudioT = {
  kind: "audio";
  payload: {
    url: string;
    fileName: string;
  };
};

export type ChatMessagePayloadT = (ChatMessageTextT | ChatMessageAudioT)["payload"];

export type ChatMessageT = {
  id: number;
  createdAt: string;
  from: number;
} & (ChatMessageTextT | ChatMessageAudioT);
