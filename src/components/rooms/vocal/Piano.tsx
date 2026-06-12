import { useDataChannel, useLocalParticipant } from "@livekit/components-react";
import { cva } from "class-variance-authority";
import type { Participant } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "#/components/ui/scroll-area";
import { NOTES, type Note } from "./keys";
import { useSynth } from "./Synth";

const noteVariant = cva(
  [
    "select-none",
    "flex",
    "gap-1",
    "flex-col",
    "items-center",
    "justify-end",
    "text-xl",
    "cursor-pointer",
    "origin-top",
    "transition-[transform,background-color,box-shadow]",
    "duration-75",
    "ease-out",
  ],
  {
    variants: {
      color: {
        white: [
          "mr-px",
          "w-[60px]",
          "h-full",
          "bg-gray-100",
          "border",
          "border-gray-400",
          "text-black",
          "rounded-b-md",
          "border",
          "border-b-2",
          "bg-stone-50",
          "border-stone-300",
          "shadow-[0_2px_0_rgba(0,0,0,0.05)]",
        ],
        black: [
          "w-[38px]",
          "h-4/7",
          "bg-gray-800",
          "ml-[-19px]",
          "mr-[-19px]",
          "z-10",
          "text-white",
          "rounded-b",
          "bg-stone-800",
          "shadow-[0_2px_0_rgba(0,0,0,0.4)]",
        ],
      },
      pressed: {
        true: "translate-y-0.5",
        false: "",
      },
    },
  },
);

const NoteOverlay = ({ note, pressed }: { note: Note; pressed: boolean }) => {
  return (
    <div
      className={`rounded-b size-full flex flex-col justify-end px-1 size-full transition-colors shadow-xl text-gray-500 ${pressed ? "text-white bg-linear-to-b from-indigo-500 to-blue-500" : null}`}
    >
      {note.name === "C" ? note.label : ""}
    </div>
  );
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const Piano = () => {
  const synth = useSynth();

  const { localParticipant } = useLocalParticipant();

  const [keys, setKeys] = useState<Record<number, Array<Participant>>>({});

  const { send: sendPress } = useDataChannel("piano-press", (msg) => {
    if (!msg.from) {
      return;
    }
    addPress(Number(decoder.decode(msg.payload)), msg.from);
  });

  const { send: sendRelease } = useDataChannel("piano-release", (msg) => {
    if (!msg.from) {
      return;
    }
    removePress(Number(decoder.decode(msg.payload)), msg.from);
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = contentRef.current?.querySelector<HTMLElement>("#C3");
    key?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: addPress/removePress are recreated every render; listeners should only re-register when the device changes
  useEffect(() => {
    synth.selectedDevice?.addListener("noteon", (e) => {
      addPress(`${e.note.name}${e.note.accidental ?? ""}${e.note.octave}`);
    });
    synth.selectedDevice?.addListener("noteoff", (e) => {
      removePress(`${e.note.name}${e.note.accidental ?? ""}${e.note.octave}`);
    });

    return () => {
      synth.selectedDevice?.removeListener();
    };
  }, [synth.selectedDevice]);

  const addPress = (
    midi: number,
    participant: Participant = localParticipant,
  ) => {
    synth.startNote(midi);
    setKeys((prev) => {
      if (!prev[midi]) {
        prev[midi] = [];
      }
      prev[midi].push(participant);
      return { ...prev };
    });
    if (!participant.isLocal) {
      return;
    }
    sendPress(encoder.encode(midi), { reliable: false });
  };

  const removePress = (
    midi: number,
    participant: Participant = localParticipant,
  ) => {
    synth.stopNote(midi);
    setKeys((prev) => {
      if (!prev[midi]) {
        prev[midi] = [];
      }
      prev[midi] = prev[midi].filter(
        (p) => p.identity !== participant.identity,
      );
      return { ...prev };
    });
    if (!participant.isLocal) {
      return;
    }
    sendRelease(encoder.encode(midi.toString()), { reliable: false });
  };

  return (
    <div className="w-full h-[200px]">
      <ScrollArea fill>
        <div ref={contentRef} className="flex h-full pb-2.5">
          {NOTES.map((note) => {
            const pressed = !!keys[note.midi]?.length;
            return (
              <button
                type="button"
                key={note.label}
                id={note.label}
                className={noteVariant({
                  color: note.color,
                })}
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                onMouseDown={() => addPress(note.midi)}
                onMouseUp={() => removePress(note.midi)}
                onMouseLeave={() => {
                  removePress(note.midi);
                }}
                onMouseEnter={(e) => {
                  if (e.buttons) {
                    addPress(note.midi);
                  }
                }}
              >
                <NoteOverlay note={note} pressed={pressed} />
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
