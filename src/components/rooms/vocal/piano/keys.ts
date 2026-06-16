import type { Participant } from "livekit-client";
import { create } from "zustand";

type KeysStoreT = {
  keys: Record<number, Array<Participant>>;
  addKeyPress: (midi: number, from: Participant) => Array<Participant>;
  removeKeyPress: (midi: number, from: Participant) => Array<Participant>;
};

export const useKeysStore = create<KeysStoreT>()((set, get) => ({
  keys: {},
  addKeyPress: (midi: number, from: Participant) => {
    const keys = { ...get().keys };
    if (!keys[midi]) {
      keys[midi] = [];
    }

    keys[midi].push(from);

    set({ keys });
    return keys[midi];
  },
  removeKeyPress: (midi: number, from: Participant) => {
    const keys = { ...get().keys };
    if (!keys[midi]) {
      return [];
    }

    keys[midi] = keys[midi].filter((p) => p.identity !== from.identity);

    set({ keys });
    return keys[midi];
  },
}));
