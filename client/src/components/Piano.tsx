import { Badge, ScrollArea } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { eventBus, useEventBus } from "./Event";
import { Input } from "webmidi";
import * as Tone from "tone";

export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;
export const OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7] as const;
export const getNoteString = ({ note, octave }: NoteT) => {
  return `${note}${octave}`;
};

const isBlack = (note: string) => {
  return note[1] === "#";
};

type PianoT = {
  midiInput?: Input;
  sampler?: Tone.Sampler;
};

export function Piano({ midiInput, sampler }: PianoT) {
  const startNote = (detail: NoteSignalT) => {
    sampler?.triggerAttack(`${detail.note}${detail.octave}`);
  };

  const stopNote = (detail: NoteSignalT) => {
    sampler?.triggerRelease(`${detail.note}${detail.octave}`);
  };

  useEventBus<NoteSignalT>("noteDown", startNote);
  useEventBus<NoteSignalT>("noteUp", stopNote);

  useEffect(() => {
    document.getElementById("C5")?.scrollIntoView();
    if (!midiInput) {
      return;
    }

    midiInput.addListener("noteon", (e) => {
      const detail = {
        note: `${e.note.name}${e.note.accidental ?? ""}`,
        octave: e.note.octave,
        local: true,
      } as NoteSignalT;
      sendNoteSignal("noteDown", detail);
    });
    midiInput.addListener("noteoff", (e) => {
      const detail = {
        note: `${e.note.name}${e.note.accidental ?? ""}`,
        octave: e.note.octave,
        local: true,
      } as NoteSignalT;
      sendNoteSignal("noteUp", detail);
    });

    return () => {
      console.log("REMOVED");
      midiInput?.removeListener();
    };
  }, [midiInput]);

  return (
    <>
      <ScrollArea type="always" scrollbars="horizontal">
        <div className="flex h-[220px]">
          {OCTAVES.map((o) =>
            NOTES.map((n) => (
              <Note
                key={getNoteString({ note: n, octave: o })}
                octave={o}
                note={n}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </>
  );
}

export type NoteT = {
  octave: (typeof OCTAVES)[number];
  note: (typeof NOTES)[number];
};

export type NoteSignalT = NoteT & {
  local?: boolean;
};

export function sendNoteSignal(
  name: "noteDown" | "noteUp",
  detail: NoteSignalT
) {
  eventBus.dispatchEvent(new CustomEvent(name, { detail }));
}

type NoteIndicatorT = NoteT & {
  active: boolean;
};

function NoteIndicator({ active, octave, note }: NoteIndicatorT) {
  if (active) {
    return (
      <>
        <Badge variant="solid">
          <i className="ri-music-fill"></i>
        </Badge>
      </>
    );
  }
  if (note === "C") {
    return getNoteString({ octave, note });
  }
}

function Note({ octave, note }: NoteT) {
  const [active, setActive] = useState(false);

  const signalHandler = (isActive: boolean) => (details: NoteT) => {
    if (!(note === details.note && octave == details.octave)) {
      return;
    }
    setActive(isActive);
  };

  useEventBus<NoteSignalT>("noteDown", signalHandler(true));
  useEventBus<NoteSignalT>("noteUp", signalHandler(false));

  return (
    <div
      id={getNoteString({ octave, note })}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onMouseDown={() =>
        sendNoteSignal("noteDown", { octave, note, local: true })
      }
      onMouseUp={() => {
        if (active) {
          sendNoteSignal("noteUp", { octave, note, local: true });
        }
      }}
      onMouseLeave={() => {
        if (active) {
          sendNoteSignal("noteUp", { octave, note, local: true });
        }
      }}
      onMouseEnter={(e) => {
        if (e.buttons) {
          sendNoteSignal("noteDown", { octave, note, local: true });
        }
      }}
      className={`select-none flex gap-1 flex-col items-center justify-end py-5 text-3xl ${isBlack(note) ? "w-[60px] h-4/6 bg-gray-800 ml-[-30px] mr-[-30px] z-10" : "w-[100px] h-full bg-gray-100 border border-gray-400 text-black"}`}
    >
      <NoteIndicator active={active} note={note} octave={octave} />
    </div>
  );
}
