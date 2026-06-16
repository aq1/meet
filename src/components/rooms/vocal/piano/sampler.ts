import * as Tone from "tone";
import { create } from "zustand";
import { samplerUrls } from "./constants";

const volumeToDb = (volume: number) => Tone.gainToDb(volume / 100);

type SamplerStoreT = {
  sampler: Tone.Sampler | null;
  volume: number;
  enable: () => Promise<void>;
  disable: () => void;
  setVolume: (volume: number) => void;
  startNote: (midi: number) => void;
  stopNote: (midi: number) => void;
};

export const useSamplerStore = create<SamplerStoreT>()((set, get) => {
  const enable = async () => {
    if (get().sampler) {
      return;
    }
    await Tone.start();
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
  };

  const disable = () => {
    const { sampler } = get();
    sampler?.dispose();
    set({ sampler: null });
  };

  const setVolume = (volume: number) => {
    const { sampler } = get();
    if (sampler) {
      sampler.volume.value = volumeToDb(volume);
    }
    set({ volume });
  };
  const startNote = (midi: number) => {
    get().sampler?.triggerAttack(Tone.Frequency(midi, "midi").toNote());
  };
  const stopNote = (midi: number) => {
    get().sampler?.triggerRelease(Tone.Frequency(midi, "midi").toNote());
  };

  return {
    sampler: null,
    volume: 100,
    enable,
    disable,
    setVolume,
    startNote,
    stopNote,
  };
});
