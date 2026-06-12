import { useEffect } from "react";
import * as Tone from "tone";
import { type Input, WebMidi } from "webmidi";
import { create } from "zustand";

const samplerUrls = {
  A0: "A0.mp3",
  A1: "A1.mp3",
  A2: "A2.mp3",
  A3: "A3.mp3",
  A4: "A4.mp3",
  A5: "A5.mp3",
  A6: "A6.mp3",
  A7: "A7.mp3",
  C1: "C1.mp3",
  C2: "C2.mp3",
  C3: "C3.mp3",
  C4: "C4.mp3",
  C5: "C5.mp3",
  C6: "C6.mp3",
  C7: "C7.mp3",
  C8: "C8.mp3",
  "D#1": "Ds1.mp3",
  "D#2": "Ds2.mp3",
  "D#3": "Ds3.mp3",
  "D#4": "Ds4.mp3",
  "D#5": "Ds5.mp3",
  "D#6": "Ds6.mp3",
  "D#7": "Ds7.mp3",
  "F#1": "Fs1.mp3",
  "F#2": "Fs2.mp3",
  "F#3": "Fs3.mp3",
  "F#4": "Fs4.mp3",
  "F#5": "Fs5.mp3",
  "F#6": "Fs6.mp3",
  "F#7": "Fs7.mp3",
} as const;

interface MidiStore {
  devices: Array<Input>;
  selectedDevice: Input | null;
  setSelectedDevice: (device: Input | null) => void;
  updateDevices: () => void;
}

const useMidiStore = create<MidiStore>((set, get) => ({
  devices: [],
  selectedDevice: null,
  setSelectedDevice: (selectedDevice) => set({ selectedDevice }),
  updateDevices: () => {
    if (WebMidi.inputs) {
      set({ devices: WebMidi.inputs });
    }
    if (!get().selectedDevice) {
      set({ selectedDevice: WebMidi.inputs.at(0) ?? null });
    }
  },
}));

const useMidi = () => {
  const { devices, selectedDevice, setSelectedDevice, updateDevices } =
    useMidiStore();

  useEffect(() => {
    WebMidi.enable().then(() => {
      WebMidi.addListener("connected", updateDevices);
      WebMidi.addListener("disconnected", updateDevices);
      updateDevices();
    });

    return () => {
      WebMidi.disable();
    };
  }, [updateDevices]);

  return { devices, selectedDevice, setSelectedDevice };
};

interface SamplerStore {
  sampler: Tone.Sampler | null;
  volume: number;
  initSampler: () => void;
  setVolume: (volume: number) => void;
  startNote: (midi: number) => void;
  stopNote: (midi: number) => void;
}

// Map a linear 0-100 slider value to decibels for Tone's volume param.
const volumeToDb = (volume: number) => Tone.gainToDb(volume / 100);

const useSamplerStore = create<SamplerStore>((set, get) => ({
  sampler: null,
  volume: 50,
  initSampler: () => {
    if (get().sampler) {
      return;
    }
    Tone.start().then(() => {
      if (get().sampler) {
        return;
      }
      const sampler = new Tone.Sampler({
        urls: samplerUrls,
        release: 1,
        baseUrl: "/notes/",
      }).toDestination();
      sampler.volume.value = volumeToDb(get().volume);
      set({ sampler });
    });
  },
  setVolume: (volume) => {
    const { sampler } = get();
    if (sampler) {
      sampler.volume.value = volumeToDb(volume);
    }
    set({ volume });
  },
  startNote: (midi) =>
    get().sampler?.triggerAttack(Tone.Frequency(midi, "midi").toNote()),
  stopNote: (midi) =>
    get().sampler?.triggerRelease(Tone.Frequency(midi, "midi").toNote()),
}));

const useSampler = () => {
  const initSampler = useSamplerStore((state) => state.initSampler);

  useEffect(() => {
    initSampler();
  }, [initSampler]);
};

export const useSynth = () => {
  useSampler();
  const midi = useMidi();

  const startNote = useSamplerStore((state) => state.startNote);
  const stopNote = useSamplerStore((state) => state.stopNote);
  const volume = useSamplerStore((state) => state.volume);
  const setVolume = useSamplerStore((state) => state.setVolume);

  return { ...midi, startNote, stopNote, volume, setVolume };
};
