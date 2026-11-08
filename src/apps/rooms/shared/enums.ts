export const CHAT_MESSAGE_KIND_VALUES = ["text", "audio"] as const;
export type ChatMessageKindT = (typeof CHAT_MESSAGE_KIND_VALUES)[number];
