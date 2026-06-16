import { type Input, WebMidi } from "webmidi";
import { create } from "zustand";

type StatusT = "disabled" | "pending" | "error" | "enabled";

type CallbackT = (kind: "press" | "release", midi: number) => void;

type MidiStoreT = {
  status: StatusT;
  inputs: Array<Input>;
  selectedInput: Input | null;
  setSelectedInput: (input: string) => void;
  enable: (callback: CallbackT) => Promise<void>;
  disable: () => Promise<void>;
  callback: CallbackT;
};

export const useMidiStore = create<MidiStoreT>()((set, get) => {
  const updateInputs = () => {
    const inputs = [...WebMidi.inputs];
    set({ inputs });

    if (!inputs.some((i) => i.id === get().selectedInput?.id)) {
      get().setSelectedInput("");
    }

    if (!get().selectedInput) {
      get().setSelectedInput(inputs.at(0)?.id ?? "");
    }
  };

  return {
    status: "disabled",
    inputs: [],
    selectedInput: null,
    callback: () => {},
    setSelectedInput: (id: string) => {
      get().selectedInput?.removeListener();

      const input = get().inputs.find((i) => i.id === id);
      set({ selectedInput: input });
      if (!input) {
        return;
      }
      const callback = get().callback;
      input.addListener("noteon", (e) => callback("press", e.note.number));
      input.addListener("noteoff", (e) => callback("release", e.note.number));
    },
    enable: async (callback) => {
      if (get().status !== "disabled") {
        return;
      }
      set({ status: "pending" });

      try {
        await WebMidi.enable();
      } catch {
        set({ status: "error" });
        return;
      }

      WebMidi.addListener("connected", updateInputs);
      WebMidi.addListener("disconnected", updateInputs);
      set({ status: "enabled", callback });
      updateInputs();
    },
    disable: async () => {
      await WebMidi.disable();
      set({
        status: "disabled",
        callback: () => {},
        selectedInput: null,
        inputs: [],
      });
    },
  };
});
