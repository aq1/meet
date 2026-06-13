import { PianoIcon, Settings, UsersIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
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
import { useControls, useParticipantVolume } from "../controls-state";
import { useSynth } from "../Synth";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-medium text-muted-foreground text-xs">{children}</h3>
);

const PianoVolumeSlider = () => {
  const { volume, setVolume } = useSynth();

  return (
    <Slider
      value={volume}
      onValueChange={(next) => setVolume(Array.isArray(next) ? next[0] : next)}
    >
      <FieldLabel className="mb-3.5 gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
        <PianoIcon />
        Piano
      </FieldLabel>
    </Slider>
  );
};

const ParticipantsVolumeSlider = () => {
  const volume = useParticipantVolume((state) => state.volume);
  const setVolume = useParticipantVolume((state) => state.setVolume);

  return (
    <Slider
      value={volume}
      onValueChange={(next) => setVolume(Array.isArray(next) ? next[0] : next)}
    >
      <FieldLabel className="mb-3.5 gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
        <UsersIcon />
        Participants
      </FieldLabel>
    </Slider>
  );
};

const ShowKeyboardSwitch = () => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);

  return (
    <FieldLabel className="-mx-2 w-[calc(100%+1rem)] justify-between gap-2 rounded-md px-2 py-1.5 font-normal text-foreground transition-colors hover:bg-accent [&_svg]:size-4 [&_svg]:text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <PianoIcon />
        Show keyboard
      </span>
      <Switch
        checked={showKeyboard}
        onCheckedChange={() => toggle("showKeyboard")}
      />
    </FieldLabel>
  );
};

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

const VolumeControls = () => {
  return (
    <div className="flex flex-col gap-5">
      <PopoverTitle>Settings</PopoverTitle>

      <section className="flex flex-col gap-3.5">
        <SectionLabel>Volume</SectionLabel>
        <Field className="w-full gap-5">
          <ParticipantsVolumeSlider />
          <PianoVolumeSlider />
        </Field>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <SectionLabel>Piano</SectionLabel>
        <Field className="w-full gap-2.5">
          <ShowKeyboardSwitch />
          <DeviceSelect />
          <FieldDescription>
            Connect a MIDI keyboard to play along.
          </FieldDescription>
        </Field>
      </section>
    </div>
  );
};

export const SettingsMenu = () => {
  const [open, setOpen] = useState(false);

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
        <VolumeControls />
      </PopoverPopup>
    </Popover>
  );
};
