import { CheckIcon, PianoIcon, Settings, UsersIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import {
  Popover,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "#/components/ui/popover";
import { Separator } from "#/components/ui/separator";
import { Slider } from "#/components/ui/slider";
import { cn } from "#/lib/utils";
import { useParticipantVolume } from "../controls-state";
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

const DeviceSelect = () => {
  const { devices, selectedDevice, setSelectedDevice } = useSynth();

  if (!devices.length) {
    return (
      <p className="px-2 py-1.5 text-muted-foreground text-sm">
        No MIDI detected
      </p>
    );
  }

  return (
    <ul aria-label="Select MIDI" className="flex flex-col">
      {devices.map((device) => {
        const selected = device.id === selectedDevice?.id;

        return (
          <li key={device.id}>
            <button
              type="button"
              onClick={() => setSelectedDevice(device)}
              className="grid w-full grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-1.5 text-start text-foreground text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              <CheckIcon
                className={cn("size-4 opacity-80", !selected && "invisible")}
              />
              {device.name}
            </button>
          </li>
        );
      })}
    </ul>
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
