import { ChevronDownIcon, ChevronUpIcon, PianoIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Group, GroupSeparator } from "#/components/ui/group";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "#/components/ui/menu";
import { useControls } from "../controls-state";
import { useMidiStore } from "../piano/midi";

const MidiMenu = ({ variant }: { variant: "default" | "outline" }) => {
  const inputs = useMidiStore((s) => s.inputs);
  const selectedInput = useMidiStore((s) => s.selectedInput);
  const setSelectedInput = useMidiStore((s) => s.setSelectedInput);

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
        <MenuRadioGroup
          value={selectedInput?.id}
          onValueChange={setSelectedInput}
        >
          {inputs.map((i) => (
            <MenuRadioItem closeOnClick key={i.id} value={i.id}>
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
  const inputs = useMidiStore((s) => s.inputs);
  const status = useMidiStore((s) => s.status);

  return (
    <Group className="hidden md:flex" aria-label="Keyboard controls">
      <Button
        onClick={() => toggle("showKeyboard")}
        variant={variant}
        size="icon-xl"
        title={showKeyboard ? "Hide keyboard" : "Show keyboard"}
      >
        <PianoIcon />
      </Button>
      {status === "enabled" && inputs.length ? (
        <>
          <GroupSeparator />
          <MidiMenu variant={variant} />
        </>
      ) : null}
    </Group>
  );
};
