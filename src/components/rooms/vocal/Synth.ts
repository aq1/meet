import { useEffect, useState } from "react";
import * as Tone from "tone";
import { Input, WebMidi } from "webmidi";

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

const useMidi = () => {
  const [devices, setDevices] = useState<Array<Input>>([]);
  const [selectedDevice, setSelectedDevice] = useState<Input | null>(null);

  const updateDevices = () => {
    if (WebMidi.inputs) {
      setDevices(WebMidi.inputs);
    }
    if (!selectedDevice) {
      setSelectedDevice(WebMidi.inputs.at(0) ?? null);
    }
  };

  useEffect(() => {
    WebMidi.enable().then(() => {
      WebMidi.addListener("connected", updateDevices);
      WebMidi.addListener("disconnected", updateDevices);
      updateDevices();
    });

    return () => {
      WebMidi.disable();
    };
  }, [WebMidi]);

  return { devices, selectedDevice, setSelectedDevice };
};

const useSampler = () => {
  const [sampler, setSampler] = useState<Tone.Sampler>();

  useEffect(() => {
    Tone.start().then(() => {
      setSampler(
        new Tone.Sampler({
          urls: samplerUrls,
          release: 1,
          baseUrl: "https://tonejs.github.io/audio/salamander/",
        }).toDestination(),
      );
    });
  }, [Tone, samplerUrls]);

  return { sampler };
};

export const useSynth = () => {
  const { sampler } = useSampler();
  const midi = useMidi();

  const startNote = (noteLabel: string) => {
    if (!sampler) {
      return;
    }
    sampler.triggerAttack(noteLabel);
  };
  const stopNote = (noteLabel: string) => {
    if (!sampler) {
      return;
    }
    sampler.triggerRelease(noteLabel);
  };

  return { ...midi, startNote, stopNote };
};
