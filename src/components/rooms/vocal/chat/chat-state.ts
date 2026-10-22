import { create } from "zustand";
import type { ChatMessageT } from "@/apps/rooms/shared/types";

type ChatState = {
  messages: Array<ChatMessageT>;
  addMessage: (messages: ChatMessageT) => void;
  setMessages: (message: Array<ChatMessageT>) => void;
  clear: () => void;
};

export const useChatState = create<ChatState>((set, get) => ({
  messages: [],
  addMessage: (message) => {
    set({ messages: [...get().messages, message] });
  },
  setMessages: (messages) => {
    set({ messages });
  },
  clear: () => {
    set({ messages: [] });
  },
}));
