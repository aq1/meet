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

interface ParticipantVolumeState {
  // Linear 0-100 slider value for the volume of all other participants.
  volume: number;
  setVolume: (volume: number) => void;
}

export const useParticipantVolume = create<ParticipantVolumeState>((set) => ({
  volume: 50,
  setVolume: (volume) => set({ volume }),
}));
