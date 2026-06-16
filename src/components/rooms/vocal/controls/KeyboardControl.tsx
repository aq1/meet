import { ChevronDownIcon, ChevronUpIcon, PianoIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useControls } from "../controls-state";
import { Group, GroupSeparator } from "#/components/ui/group";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "#/components/ui/menu";
import { usePianoStore } from "../piano/piano";

const MidiMenu = ({ variant }: { variant: "default" | "outline" }) => {
  const inputs = usePianoStore((s) => s.inputs);
  const selectedInput = usePianoStore((s) => s.selectedInput);
  const setSelectedInput = usePianoStore((s) => s.setSelectedInput);

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant={variant}
            size="icon-xl"
            className="w-7 md:w-6"
            aria-label="Select microphone"
            title="Select microphone"
          />
        }
      >
        <ChevronUpIcon className="inline md:hidden" aria-hidden="true" />
        <ChevronDownIcon className="hidden md:inline" aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup side="top" sideOffset={14} align="end" className="w-72">
        <MenuRadioGroup value={selectedInput} onValueChange={setSelectedInput}>
          {inputs.map((i) => (
            <MenuRadioItem closeOnClick key={i.id} value={i}>
              {i.name}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  );
};

export const KeyboardControl = () => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);
  const variant = showKeyboard ? "default" : "outline";
  const inputs = usePianoStore((s) => s.inputs);

  return (
    <Group aria-label="Microphone controls">
      <Button
        onClick={() => toggle("showKeyboard")}
        variant={variant}
        size="icon-xl"
        title={showKeyboard ? "Hide keyboard" : "Show keyboard"}
      >
        <PianoIcon />
      </Button>
      {inputs.length ? (
        <>
          <GroupSeparator />
          <MidiMenu variant={variant} />
        </>
      ) : null}
    </Group>
  );
};
