import { create } from "zustand";
import { useLivekit } from "./room-state";

interface PianoState {
  keys: Partial<Record<number, Set<string>>>;
  addPress: (midi: number, initiator: "local" | "remote") => void;
  removePress: (midi: number, initiator: "local" | "remote") => void;
}

export const usePiano = create<PianoState>((set, get) => ({
  keys: {},
  addPress: (midi: number, initiator: "local" | "remote") => {
    const livekit = useLivekit.getState();
    if (initiator === "local") {
      livekit.sendMidi(midi, true);
    }

    const keys = get().keys;
    if (!keys[midi]) {
      keys[midi] = new Set();
    }
    keys[midi].add(initiator);
    set((state) => ({ ...state, keys }));
  },
  removePress: (midi: number, initiator: "local" | "remote") => {
    const livekit = useLivekit.getState();
    if (initiator === "local") {
      livekit.sendMidi(midi, false);
    }
    const keys = get().keys;
    if (!keys[midi]) {
      keys[midi] = new Set();
    }
    keys[midi].delete(initiator);
    set((state) => ({ ...state, keys }));
  },
}));
