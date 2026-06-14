import { create } from "zustand";

interface ControlsState {
  showChat: boolean;
  showKeyboard: boolean;
  toggle: (name: keyof ControlsState) => void;
  set: (name: keyof ControlsState, value: boolean) => void;
}

export const useControls = create<ControlsState>((set) => ({
  showChat: true,
  showKeyboard: true,
  toggle: (name) => set((state) => ({ ...state, [name]: !state[name] })),
  set: (name, value) => set((state) => ({ ...state, [name]: value })),
}));

interface ParticipantVolumeState {
  // Linear 0-100 slider value for the volume of all other participants.
  volume: number;
  setVolume: (volume: number) => void;
}

export const useParticipantVolume = create<ParticipantVolumeState>((set) => ({
  volume: 100,
  setVolume: (volume) => set({ volume }),
}));
