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

  const [keys, setKeys] = useState<Record<string, Array<Participant>>>({});

  const { send: sendPress } = useDataChannel("piano-press", (msg) => {
    if (!msg.from) {
      return;
    }
    addPress(decoder.decode(msg.payload), msg.from);
  });

  const { send: sendRelease } = useDataChannel("piano-release", (msg) => {
    if (!msg.from) {
      return;
    }
    removePress(decoder.decode(msg.payload), msg.from);
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = contentRef.current?.querySelector<HTMLElement>("#C3");
    key?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  useEffect(() => { }, [synth.selectedDevice])

  const addPress = (
    noteLabel: string,
    participant: Participant = localParticipant,
  ) => {
    synth.startNote(noteLabel);
    setKeys((prev) => {
      if (!prev[noteLabel]) {
        prev[noteLabel] = [];
      }
      prev[noteLabel].push(participant);
      return { ...prev };
    });
    if (!participant.isLocal) {
      return;
    }
    sendPress(encoder.encode(noteLabel), { reliable: false });
  };

  const removePress = (
    noteLabel: string,
    participant: Participant = localParticipant,
  ) => {
    synth.stopNote(noteLabel);
    setKeys((prev) => {
      if (!prev[noteLabel]) {
        prev[noteLabel] = [];
      }
      prev[noteLabel] = prev[noteLabel].filter(
        (p) => p.identity !== participant.identity,
      );
      return { ...prev };
    });
    if (!participant.isLocal) {
      return;
    }
    sendRelease(encoder.encode(noteLabel), { reliable: false });
  };

  return (
    <div className="w-full h-[200px]">
      {synth.selectedDevice?.name}
      <ScrollArea fill>
        <div ref={contentRef} className="flex h-full pb-2.5">
          {NOTES.map((note) => {
            const pressed = !!keys[note.label]?.length;
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
                onMouseDown={() => addPress(note.label)}
                onMouseUp={() => removePress(note.label)}
                onMouseLeave={() => {
                  removePress(note.label);
                }}
                onMouseEnter={(e) => {
                  if (e.buttons) {
                    addPress(note.label);
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
