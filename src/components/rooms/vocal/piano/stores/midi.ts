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

  const enableMidi = async () => {
    if (get().midiEnabled) {
      return
    }

    set({ midiEnabled: true })

    console.log("MIDI INIT")
    try {
      await WebMidi.enable();
      WebMidi.addListener("connected", updateDevices);
      WebMidi.addListener("disconnected", updateDevices);
    } catch {
      console.warn("Could not enable WebMidi")
      set({ midiEnabled: false })
      return;
    } finally {
      updateDevices();
    }
  };

  const disableMidi = async () => {
    setSelectedInput(null);
    set({ inputs: [] });
    await WebMidi.disable();
  };

  return {
    midiEnabled: false,
    inputs: [],
    selectedInput: null,
    setSelectedInput,
    enableMidi,
    disableMidi,
  };
};
