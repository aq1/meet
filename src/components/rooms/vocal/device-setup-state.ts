import { create } from "zustand";

interface DeviceSetupState {
  cameraEnabled: boolean;
  micEnabled: boolean;
  cameraDeviceId?: string;
  micDeviceId?: string;
  speakerDeviceId?: string;
  setCameraEnabled: (value: boolean) => void;
  setMicEnabled: (value: boolean) => void;
  setCameraDeviceId: (deviceId: string) => void;
  setMicDeviceId: (deviceId: string) => void;
  setSpeakerDeviceId: (deviceId: string) => void;
}

export const useDeviceSetup = create<DeviceSetupState>((set) => ({
  cameraEnabled: true,
  micEnabled: true,
  setCameraEnabled: (cameraEnabled) => set({ cameraEnabled }),
  setMicEnabled: (micEnabled) => set({ micEnabled }),
  setCameraDeviceId: (cameraDeviceId) => set({ cameraDeviceId }),
  setMicDeviceId: (micDeviceId) => set({ micDeviceId }),
  setSpeakerDeviceId: (speakerDeviceId) => set({ speakerDeviceId }),
}));
