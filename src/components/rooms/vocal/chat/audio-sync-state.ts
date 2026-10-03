import { create } from "zustand";

export type AudioSync = { url: string; action: "play" | "pause"; time: number };

interface AudioSyncState {
  sync: AudioSync | null;
  send: ((msg: AudioSync) => void) | null;
  receive: (msg: AudioSync) => void;
  control: (msg: AudioSync) => void;
}

export const useAudioSync = create<AudioSyncState>((set, get) => ({
  sync: null,
  send: null,
  receive: (msg) => set({ sync: { ...msg } }),
  control: (msg) => {
    set({ sync: { ...msg } });
    get().send?.(msg);
  },
}));
