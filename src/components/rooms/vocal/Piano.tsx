import { ScrollArea } from "#/components/ui/scroll-area";
import { NOTES, type Note } from "./keys";
import { cva } from "class-variance-authority";
import { useEffect } from "react";
import { useLivekit, type Message } from "./room-state";
import { RoomEvent } from "livekit-client";
import { usePiano } from "./piano-state";

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

const Key = ({ note }: { note: Note }) => {
  const pianoState = usePiano();
  const pressed = !!pianoState.keys[note.midi]?.size;

  return (
    <div
      id={note.label}
      className={noteVariant({
        color: note.color,
      })}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onMouseDown={() => pianoState.addPress(note.midi, "local")}
      onMouseUp={() => pianoState.removePress(note.midi, "local")}
      onMouseLeave={() => {
        pianoState.removePress(note.midi, "local");
      }}
      onMouseEnter={(e) => {
        if (e.buttons) {
          pianoState.addPress(note.midi, "local");
        }
      }}
    >
      <NoteOverlay note={note} pressed={pressed} />
    </div>
  );
};

const decoder = new TextDecoder();

export const Piano = () => {
  const livekit = useLivekit();
  const piano = usePiano();

  useEffect(() => {
    if (!livekit.room) {
      return;
    }

    const handleIncomingMidi = (payload: Uint8Array) => {
      const msg: Message = JSON.parse(decoder.decode(payload));
      if (msg.type !== "midi") {
        return;
      }
      if (msg.on) {
        piano.addPress(msg.midi, "remote");
      } else {
        piano.removePress(msg.midi, "remote");
      }
    };

    livekit.room.on(RoomEvent.DataReceived, handleIncomingMidi);
    return () => {
      livekit.room.off(RoomEvent.DataReceived, handleIncomingMidi);
    };
  }, [livekit.room]);

  return (
    <div className="w-full h-[200px]">
      <ScrollArea fill>
        <div className="flex h-full pb-2.5">
          {NOTES.map((n) => (
            <Key key={n.label} note={n} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
