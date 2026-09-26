import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ControlsState {
  showChat: boolean;
  showKeyboard: boolean;
  showFiles: boolean;
  volume: number;
  fileVolume: number;
  cameraEnabled: boolean;
  micEnabled: boolean;
  cameraDeviceId?: string;
  micDeviceId?: string;
  speakerDeviceId?: string;
  toggle: (name: "showChat" | "showKeyboard" | "showFiles") => void;
  set: (name: "showChat" | "showKeyboard" | "showFiles", value: boolean) => void;
  setVolume: (volume: number) => void;
  setFileVolume: (volume: number) => void;
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
      showFiles: false,
      volume: 100,
      fileVolume: 100,
      cameraEnabled: true,
      micEnabled: true,
      cameraDeviceId: "",
      micDeviceId: "",
      speakerDeviceId: "",
      toggle: (name) =>
        set((state) => {
          const newValue = !state[name];
          if (name === "showChat" && newValue) {
            state.showFiles = false;
          }
          if (name === "showFiles" && newValue) {
            state.showChat = false;
          }
          return { ...state, [name]: newValue };
        }),
      set: (name, value) => set((state) => ({ ...state, [name]: value })),
      setVolume: (volume) => set({ volume }),
      setFileVolume: (fileVolume) => set({ fileVolume }),
      setCameraEnabled: (cameraEnabled) => set({ cameraEnabled }),
      setMicEnabled: (micEnabled) => set({ micEnabled }),
      setCameraDeviceId: (cameraDeviceId) => set({ cameraDeviceId }),
      setMicDeviceId: (micDeviceId) => set({ micDeviceId }),
      setSpeakerDeviceId: (speakerDeviceId) => set({ speakerDeviceId }),
    }),
    {
      name: "controls",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: ({ cameraDeviceId, micDeviceId, speakerDeviceId, ...rest }) => rest,
    },
  ),
);
