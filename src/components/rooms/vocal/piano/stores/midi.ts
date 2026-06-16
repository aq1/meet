import { type Input, WebMidi } from "webmidi";
import type { StateCreator } from "zustand";
import type { PianoStoreT, MidiSliceT } from "./types";

export const createMidiSlice: StateCreator<PianoStoreT, [], [], MidiSliceT> = (
  set,
  get,
) => {
  const updateDevices = () => {
    const inputs = [...WebMidi.inputs];

    set({ inputs });

    if (!inputs.find((i) => i.id == get().selectedInput?.id)) {
      get().setSelectedInput(null);
    }

    if (!get().selectedInput) {
      get().setSelectedInput(inputs.at(0) ?? null);
    }
  };

  const enableMidi = async () => {
    if (WebMidi.enabled) {
      return;
    }
    try {
      await WebMidi.enable();
    } catch {
      return;
    }
    WebMidi.addListener("connected", updateDevices);
    WebMidi.addListener("disconnected", updateDevices);
    updateDevices();
  };

  const setSelectedInput = (input: Input | null) => {
    get().selectedInput?.removeListener();
    set({ selectedInput: input });
    if (!input) {
      return;
    }
    input.addListener("noteon", (e) => {
      get().addPress(e.note.number);
    });
    input.addListener("noteoff", (e) => {
      get().removePress(e.note.number);
    });
  };

  const disableMidi = async () => {
    setSelectedInput(null);
    set({ inputs: [] });
    await WebMidi.disable();
  };

  return {
    inputs: [],
    selectedInput: null,
    setSelectedInput,
    enableMidi,
    disableMidi,
  };
};
