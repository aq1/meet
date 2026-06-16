import type { LocalParticipant, Participant } from "livekit-client";
import * as Tone from "tone";
import type { Input } from "webmidi";

export type MidiSliceT = {
  inputs: Array<Input>;
  selectedInput: Input | null;
  setSelectedInput: (input: Input | null) => void;
  enableMidi: () => Promise<void>;
  disableMidi: () => Promise<void>;
};

export type SamplerSliceT = {
  sampler: Tone.Sampler | null;
  volume: number;
  enableSampler: () => Promise<void>;
  disableSampler: () => void;
  setVolume: (volume: number) => void;
  startNote: (midi: number) => void;
  stopNote: (midi: number) => void;
};

export type KeyInteractionT = (
  midi: number,
  participant: Participant,
) => Promise<void>;

export type LocalKeyInteractionT = (
  midi: number,
  participant?: Participant,
) => Promise<void>;

export type KeyboardSliceT = {
  keys: Record<number, Array<Participant>>;
  localParticipant: LocalParticipant | null;
  onPress: KeyInteractionT;
  onRelease: KeyInteractionT;
  addPress: LocalKeyInteractionT;
  removePress: LocalKeyInteractionT;
  enableKeyboard: (
    localParticipant: LocalParticipant,
    onPress: KeyInteractionT,
    onRelease: KeyInteractionT,
  ) => void;
};

export type PianoStoreT = MidiSliceT &
  SamplerSliceT &
  KeyboardSliceT & {
    enable: (
      localParticipant: LocalParticipant,
      onPress: KeyInteractionT,
      onRelease: KeyInteractionT,
    ) => Promise<void>;
    disable: () => Promise<void>;
  };
