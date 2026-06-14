import { useDataChannel, useLocalParticipant } from "@livekit/components-react";
import { cva } from "class-variance-authority";
import { useEffect, useRef } from "react";
import { ScrollArea } from "#/components/ui/scroll-area";
import { NOTES, type Note } from "./keys";
import { usePianoStore } from "./piano-state";
import { useSynth } from "./Synth";

const noteVariant = cva(
  [
    "select-none",
    "touch-none",
    "[-webkit-touch-callout:none]",
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
      className={`flex size-full size-full flex-col justify-end rounded-b px-1 text-gray-500 shadow-xl transition-colors ${pressed ? "bg-linear-to-b from-indigo-500 to-blue-500 text-white" : null}`}
    >
      {note.name === "C" ? note.label : ""}
    </div>
  );
};

const decoder = new TextDecoder();

const PianoKey = ({ note }: { note: Note }) => {
  const pressed = usePianoStore((state) => !!state.keys[note.midi]?.length);
  const addPress = usePianoStore((state) => state.addPress);
  const removePress = usePianoStore((state) => state.removePress);

  return (
    <button
      type="button"
      id={note.label}
      title={note.label}
      className={noteVariant({
        color: note.color,
      })}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onMouseDown={() => addPress(note.midi)}
      onMouseUp={() => removePress(note.midi)}
      onMouseLeave={(e) => {
        if (e.buttons) {
          removePress(note.midi);
        }
      }}
      onMouseEnter={(e) => {
        if (e.buttons) {
          addPress(note.midi);
        }
      }}
      onTouchStart={() => {
        // Prevent the simulated mouse events so addPress isn't called twice
        addPress(note.midi);
      }}
      onTouchEnd={() => {
        removePress(note.midi);
      }}
      onTouchCancel={() => removePress(note.midi)}
    >
      <NoteOverlay note={note} pressed={pressed} />
    </button>
  );
};

export const Piano = () => {
  const { selectedDevice } = useSynth();

  const { localParticipant } = useLocalParticipant();

  const { send: sendPress } = useDataChannel("piano-press", (msg) => {
    if (!msg.from) {
      return;
    }
    usePianoStore
      .getState()
      .addPress(Number(decoder.decode(msg.payload)), msg.from);
  });

  const { send: sendRelease } = useDataChannel("piano-release", (msg) => {
    if (!msg.from) {
      return;
    }
    usePianoStore
      .getState()
      .removePress(Number(decoder.decode(msg.payload)), msg.from);
  });

  // Feed the React-only dependencies into the store so its actions stay stable.
  useEffect(() => {
    usePianoStore.getState().bind({ localParticipant, sendPress, sendRelease });
  }, [localParticipant, sendPress, sendRelease]);

  // Clear any lingering presses when the keyboard unmounts.
  useEffect(() => usePianoStore.getState().reset, []);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = contentRef.current?.querySelector<HTMLElement>("#C3");
    key?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  useEffect(() => {
    const { addPress, removePress } = usePianoStore.getState();
    selectedDevice?.addListener("noteon", (e) => {
      addPress(e.note.number);
    });
    selectedDevice?.addListener("noteoff", (e) => {
      removePress(e.note.number);
    });

    return () => {
      selectedDevice?.removeListener();
    };
  }, [selectedDevice]);

  return (
    <div className="h-[200px] w-full">
      <ScrollArea fill>
        <div ref={contentRef} className="flex h-full pb-2.5">
          {NOTES.map((note) => (
            <PianoKey key={note.label} note={note} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
