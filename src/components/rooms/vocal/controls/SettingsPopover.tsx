import { PianoIcon, Settings, UsersIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldLabel } from "#/components/ui/field";
import {
  Popover,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "#/components/ui/popover";
import { Slider } from "#/components/ui/slider";
import { useParticipantVolume } from "../controls-state";
import { useSynth } from "../Synth";

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

const VolumeControls = () => {
  return (
    <div className="flex flex-col gap-4">
      <PopoverTitle>Volume</PopoverTitle>
      <Field className="w-full gap-5">
        <ParticipantsVolumeSlider />
        <PianoVolumeSlider />
      </Field>
    </div>
  );
};

export const SettingsPopover = () => {
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
