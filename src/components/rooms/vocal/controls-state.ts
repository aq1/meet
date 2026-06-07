import { create } from "zustand";

interface ControlsState {
  showChat: boolean;
  showKeyboard: boolean;
  toggle: (name: keyof ControlsState) => void;
}

export const useControls = create<ControlsState>((set) => ({
  showChat: true,
  showKeyboard: true,
  toggle: (name) => set((state) => ({ ...state, [name]: !state[name] })),
}));
