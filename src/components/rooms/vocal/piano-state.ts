import type { DataPublishOptions, Participant } from "livekit-client";
import { create } from "zustand";
import { useSamplerStore } from "./Synth";

const encoder = new TextEncoder();

type SendFn = (
  payload: Uint8Array,
  options: DataPublishOptions,
) => void | Promise<void>;

const noop: SendFn = () => {};

interface PianoState {
  // midi -> participants currently holding the key down
  keys: Record<number, Array<Participant>>;
  // Dependencies that live in React hooks, injected via bind().
  localParticipant: Participant | null;
  sendPress: SendFn;
  sendRelease: SendFn;
  bind: (deps: {
    localParticipant: Participant;
    sendPress: SendFn;
    sendRelease: SendFn;
  }) => void;
  reset: () => void;
  addPress: (midi: number, participant?: Participant) => void;
  removePress: (midi: number, participant?: Participant) => void;
}

export const usePianoStore = create<PianoState>((set, get) => ({
  keys: {},
  localParticipant: null,
  sendPress: noop,
  sendRelease: noop,
  bind: ({ localParticipant, sendPress, sendRelease }) =>
    set({ localParticipant, sendPress, sendRelease }),
  reset: () => set({ keys: {} }),
  addPress: (midi, participant) => {
    const { localParticipant, sendPress } = get();
    const target = participant ?? localParticipant;
    if (!target) {
      return;
    }
    useSamplerStore.getState().startNote(midi);
    set((state) => ({
      keys: { ...state.keys, [midi]: [...(state.keys[midi] ?? []), target] },
    }));
    if (!target.isLocal) {
      return;
    }
    sendPress(encoder.encode(midi.toString()), { reliable: false });
  },
  removePress: (midi, participant) => {
    const { localParticipant, sendRelease } = get();
    const target = participant ?? localParticipant;
    if (!target) {
      return;
    }
    useSamplerStore.getState().stopNote(midi);
    set((state) => ({
      keys: {
        ...state.keys,
        [midi]: (state.keys[midi] ?? []).filter(
          (p) => p.identity !== target.identity,
        ),
      },
    }));
    if (!target.isLocal) {
      return;
    }
    sendRelease(encoder.encode(midi.toString()), { reliable: false });
  },
}));
