import type { StateCreator } from "zustand";
import type {
  KeyboardSliceT,
  PianoStoreT,
  KeyInteractionT,
  LocalKeyInteractionT,
} from "./types";
import type { LocalParticipant } from "livekit-client";

export const createKeyboardSlice: StateCreator<
  PianoStoreT,
  [],
  [],
  KeyboardSliceT
> = (set, get) => {
  const addPress: LocalKeyInteractionT = async (midi, participant) => {
    const keys = { ...get().keys };
    if (!keys[midi]) {
      keys[midi] = [];
    }

    const localParticipant = get().localParticipant;
    if (!localParticipant) {
      throw new Error("Piano State was not enabled");
    }
    const actualParticipant = participant ?? localParticipant;

    keys[midi].push(actualParticipant);

    set({ keys });
    get().startNote(midi);
    await get().onPress(midi, actualParticipant);
  };

  const removePress: LocalKeyInteractionT = async (midi, participant) => {
    const keys = { ...get().keys };
    if (!keys[midi]) {
      return;
    }

    const localParticipant = get().localParticipant;
    if (!localParticipant) {
      throw new Error("Piano State was not enabled");
    }
    const actualParticipant = participant ?? localParticipant;
    keys[midi] = keys[midi].filter(
      (p) => p.identity !== actualParticipant.identity,
    );

    set({ keys });

    if (!keys[midi].length) {
      get().stopNote(midi);
    }
    await get().onRelease(midi, actualParticipant);
  };

  const enableKeyboard = (
    localParticipant: LocalParticipant,
    onPress: KeyInteractionT,
    onRelease: KeyInteractionT,
  ) => {
    set({ localParticipant, onPress, onRelease });
  };

  return {
    keys: [],
    addPress,
    removePress,
    localParticipant: null,
    onPress: async () => {},
    onRelease: async () => {},
    enableKeyboard,
  };
};
