import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ControlsState {
  showChat: boolean;
  showKeyboard: boolean;
  volume: number;
  toggle: (name: "showChat" | "showKeyboard") => void;
  set: (name: "showChat" | "showKeyboard", value: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useControls = create<ControlsState>()(
  persist(
    (set) => ({
      showChat: true,
      showKeyboard: true,
      volume: 100,
      toggle: (name) => set((state) => ({ ...state, [name]: !state[name] })),
      set: (name, value) => set((state) => ({ ...state, [name]: value })),
      setVolume: (volume) => set({ volume }),
    }),
    { name: "controls", storage: createJSONStorage(() => localStorage), },
  ),
);
