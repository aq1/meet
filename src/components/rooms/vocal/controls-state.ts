import { create } from "zustand";

interface ControlsState {
  showChat: boolean;
  showKeyboard: boolean;
  micOn: boolean;
  cameraOn: boolean;
  toggle: (name: keyof ControlsState) => void;
}

export const useControls = create<ControlsState>((set) => ({
  showChat: true,
  showKeyboard: true,
  micOn: true,
  cameraOn: true,
  toggle: (name) => set((state) => ({ ...state, [name]: !state[name] })),
}));
