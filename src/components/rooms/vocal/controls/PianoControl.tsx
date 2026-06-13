import { ChevronDownIcon, ChevronUpIcon, PianoIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { Group, GroupSeparator } from "#/components/ui/group";
import { Popover, PopoverPopup, PopoverTrigger } from "#/components/ui/popover";
import { useIsMobile } from "#/hooks/use-media-query";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { useControls } from "../controls-state";
import { useSynth } from "../Synth";

const DeviceSelect = () => {
  const { devices, selectedDevice, setSelectedDevice } = useSynth();

  const items = devices.map((d) => ({ label: d.name, value: d }));

  return (
    <Select
      aria-label="Select MIDI"
      items={items}
      onValueChange={setSelectedDevice}
      value={selectedDevice}
    >
      <SelectTrigger disabled>
        <SelectValue
          placeholder={items.length ? "Select MIDI" : "No MIDI detected"}
        />
      </SelectTrigger>
      <SelectPopup>
        {items.map(({ label, value }) => (
          <SelectItem key={value.id} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
};

const MidiSettings = () => {
  return (
    <Field>
      <FieldLabel className="gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
        <PianoIcon />
        MIDI
      </FieldLabel>
      <DeviceSelect />
      <FieldDescription>
        Connect a MIDI keyboard to play along.
      </FieldDescription>
    </Field>
  );
};

const MidiMenu = ({
  variant,
}: {
  variant: "default" | "outline";
}) => {
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={variant}
            size="icon-xl"
            className="w-7 sm:w-6"
            aria-label="Select MIDI device"
            title="Select MIDI device"
          />
        }
      >
        {isMobile ? (
          <ChevronUpIcon aria-hidden="true" />
        ) : (
          <ChevronDownIcon aria-hidden="true" />
        )}
      </PopoverTrigger>
      <PopoverPopup side="top" sideOffset={14} align="end" className="w-72">
        <MidiSettings />
      </PopoverPopup>
    </Popover>
  );
};

export const PianoControl = () => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);
  const variant = showKeyboard ? "default" : "outline";

  return (
    <Group aria-label="Piano controls">
      <Button
        onClick={() => toggle("showKeyboard")}
        variant={variant}
        size="icon-xl"
        title={showKeyboard ? "Hide piano" : "Show piano"}
      >
        <PianoIcon />
      </Button>
      <GroupSeparator />
      <MidiMenu variant={variant} />
    </Group>
  );
};
