import type { prepareChatMessage } from "../services/chat/prepare-chat-message";

export type ChatMessageT = ReturnType<typeof prepareChatMessage>;
