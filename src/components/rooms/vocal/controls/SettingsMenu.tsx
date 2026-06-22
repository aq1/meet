import { Music2Icon, PianoIcon, Settings, UsersIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldLabel } from "#/components/ui/field";
import { Fieldset, FieldsetLegend } from "#/components/ui/fieldset";
import {
  Popover,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "#/components/ui/popover";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Separator } from "#/components/ui/separator";
import { Slider } from "#/components/ui/slider";
import { Switch } from "#/components/ui/switch";
import { useIsTablet } from "#/hooks/use-media-query";
import { useControls } from "./controls-state";
import { useMidiStore } from "../piano/midi";
import { useSamplerStore } from "../piano/sampler";

const PianoVolumeSlider = () => {
  const volume = useSamplerStore((s) => s.volume);
  const setVolume = useSamplerStore((s) => s.setVolume);

  return (
    <Field>
      <Slider
        value={volume}
        onValueChange={(next) =>
          setVolume(Array.isArray(next) ? next[0] : next)
        }
      >
        <FieldLabel className="mb-3.5 gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
          <PianoIcon />
          Piano
        </FieldLabel>
      </Slider>
    </Field>
  );
};

const ParticipantsVolumeSlider = () => {
  const volume = useControls((state) => state.volume);
  const setVolume = useControls((state) => state.setVolume);

  return (
    <Field>
      <Slider
        value={volume}
        onValueChange={(next) =>
          setVolume(Array.isArray(next) ? next[0] : next)
        }
      >
        <FieldLabel className="mb-3.5 gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
          <UsersIcon />
          Participants
        </FieldLabel>
      </Slider>
    </Field>
  );
};

const PianoToggle = () => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);

  return (
    <Field className="flex-row items-center justify-between">
      <FieldLabel className="gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
        <PianoIcon />
        Show piano
      </FieldLabel>
      <Switch
        checked={showKeyboard}
        onCheckedChange={() => toggle("showKeyboard")}
      />
    </Field>
  );
};

const MidiSelector = () => {
  const inputs = useMidiStore((s) => s.inputs);
  const status = useMidiStore((s) => s.status);
  const selectedInput = useMidiStore((s) => s.selectedInput);
  const setSelectedInput = useMidiStore((s) => s.setSelectedInput);

  if (status !== "enabled" || !inputs.length) {
    return null;
  }

  return (
    <Field>
      <FieldLabel className="gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
        <Music2Icon />
        MIDI device
      </FieldLabel>
      <Select
        items={inputs.map((i) => ({ label: i.name, value: i.id }))}
        value={selectedInput?.id ?? ""}
        onValueChange={(next) => {
          if (next) setSelectedInput(next);
        }}
      >
        <SelectTrigger size="sm" aria-label="MIDI device">
          <SelectValue placeholder="No MIDI device detected" />
        </SelectTrigger>
        <SelectPopup>
          {inputs.map((i) => (
            <SelectItem key={i.id} value={i.id}>
              {i.name}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </Field>
  );
};

const VolumeControls = () => {
  return (
    <Fieldset className="flex w-full flex-col gap-3">
      <FieldsetLegend>Volume</FieldsetLegend>
      <ParticipantsVolumeSlider />
      <PianoVolumeSlider />
    </Fieldset>
  );
};

export const SettingsMenu = () => {
  const [open, setOpen] = useState(false);
  const isTablet = useIsTablet();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant={open ? "default" : "outline"}
            size="icon-xl"
            title="Settings"
          />
        }
      >
        <Settings />
      </PopoverTrigger>
      <PopoverPopup sideOffset={14} className="w-84">
        <div className="pb-4">
          <PopoverTitle>Settings</PopoverTitle>
        </div>
        {isTablet ? (
          <>
            <div className="flex flex-col gap-4">
              <PianoToggle />
              <MidiSelector />
            </div>
            <Separator className="my-4" />
          </>
        ) : null}
        <VolumeControls />
        <Separator />
      </PopoverPopup>
    </Popover>
  );
};
