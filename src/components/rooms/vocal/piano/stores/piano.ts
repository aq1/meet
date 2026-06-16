import { create } from "zustand";
import type { PianoStoreT } from "./types";
import { createMidiSlice } from "./midi";
import { createSamplerSlice } from "./sampler";
import { createKeyboardSlice } from "./keyboard";

export const usePianoStore = create<PianoStoreT>()((...a) => {
  const [_, get] = a;

  return {
    ...createMidiSlice(...a),
    ...createSamplerSlice(...a),
    ...createKeyboardSlice(...a),
    enable: async (localParticipant, onPress, onRelease) => {
      const { enableMidi, enableSampler, enableKeyboard } = get();

      enableKeyboard(localParticipant, onPress, onRelease);
      await Promise.all([enableMidi(), enableSampler()]);
    },
    disable: async () => {
      const { disableMidi, disableSampler } = get();

      await disableMidi();
      disableSampler();
    },
  };
});
