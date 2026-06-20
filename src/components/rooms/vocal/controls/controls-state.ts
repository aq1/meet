import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ControlsState {
  showChat: boolean;
  showKeyboard: boolean;
  volume: number;
  cameraEnabled: boolean;
  micEnabled: boolean;
  cameraDeviceId?: string;
  micDeviceId?: string;
  speakerDeviceId?: string;
  toggle: (name: "showChat" | "showKeyboard") => void;
  set: (name: "showChat" | "showKeyboard", value: boolean) => void;
  setVolume: (volume: number) => void;
  setCameraEnabled: (value: boolean) => void;
  setMicEnabled: (value: boolean) => void;
  setCameraDeviceId: (deviceId: string) => void;
  setMicDeviceId: (deviceId: string) => void;
  setSpeakerDeviceId: (deviceId: string) => void;
}

export const useControls = create<ControlsState>()(
  persist(
    (set) => ({
      showChat: true,
      showKeyboard: true,
      volume: 100,
      cameraEnabled: true,
      micEnabled: true,
      toggle: (name) => set((state) => ({ ...state, [name]: !state[name] })),
      set: (name, value) => set((state) => ({ ...state, [name]: value })),
      setVolume: (volume) => set({ volume }),
      setCameraEnabled: (cameraEnabled) => set({ cameraEnabled }),
      setMicEnabled: (micEnabled) => set({ micEnabled }),
      setCameraDeviceId: (cameraDeviceId) => set({ cameraDeviceId }),
      setMicDeviceId: (micDeviceId) => set({ micDeviceId }),
      setSpeakerDeviceId: (speakerDeviceId) => set({ speakerDeviceId }),
    }),
    { name: "controls", storage: createJSONStorage(() => localStorage) },
  ),
);
