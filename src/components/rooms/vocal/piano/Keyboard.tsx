import { cva } from "class-variance-authority";
import { ScrollArea } from "#/components/ui/scroll-area";
import { NOTES, type Note } from "./constants";
import { useKeysStore } from "./keys";

const keyVariant = cva(
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

const keyOverlayVariant = cva(
  "flex size-full flex-col justify-end rounded-b px-1 text-gray-500 shadow-xl transition-colors",
  {
    variants: {
      pressed: {
        true: "bg-linear-to-b from-indigo-500 to-blue-500 text-white",
        false: "",
      },
    },
  },
);

type KeyOverlayPropsT = { note: Note };

const KeyOverlay = ({ note }: KeyOverlayPropsT) => {
  const pressed = useKeysStore((s) => !!s.keys[note.midi]?.length);

  return (
    <div
      className={keyOverlayVariant({
        pressed,
      })}
    >
      {note.name === "C" ? note.label : ""}
    </div>
  );
};

type KeyboardPropsT = {
  callback: (kind: "press" | "release", midi: number) => void;
};

type PianoKeyPropsT = KeyboardPropsT & { note: Note };

const PianoKey = ({ note, callback }: PianoKeyPropsT) => {
  return (
    <button
      type="button"
      id={note.label}
      title={note.label}
      className={keyVariant({
        color: note.color,
      })}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onMouseDown={() => callback("press", note.midi)}
      onMouseUp={() => callback("release", note.midi)}
      onMouseLeave={(e) => {
        if (e.buttons) {
          callback("release", note.midi);
        }
      }}
      onMouseEnter={(e) => {
        if (e.buttons) {
          callback("press", note.midi);
        }
      }}
      onTouchStart={() => {
        // Prevent the simulated mouse events so addPress isn't called twice
        callback("press", note.midi);
      }}
      onTouchEnd={() => {
        callback("release", note.midi);
      }}
      onTouchCancel={() => callback("release", note.midi)}
    >
      <KeyOverlay note={note} />
    </button>
  );
};

export const Keyboard = ({ callback }: KeyboardPropsT) => {
  return (
    <div className="h-[200px] w-full">
      <ScrollArea fill>
        <div className="flex h-full pb-2.5">
          {NOTES.map((note) => (
            <PianoKey key={note.label} note={note} callback={callback} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
