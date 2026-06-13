import { PianoIcon, Settings, UsersIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldLabel } from "#/components/ui/field";
import { Popover, PopoverPopup, PopoverTrigger } from "#/components/ui/popover";
import { Slider, SliderValue } from "#/components/ui/slider";
import { useParticipantVolume } from "../controls-state";
import { useSynth } from "../Synth";

const PianoVolumeSlider = () => {
  const { volume, setVolume } = useSynth();

  return (
    <Slider
      value={volume}
      onValueChange={(next) => setVolume(Array.isArray(next) ? next[0] : next)}
    >
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <FieldLabel className="gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
          <PianoIcon />
          Piano
        </FieldLabel>
        <SliderValue className="font-medium text-foreground text-xs tabular-nums" />
      </div>
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
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <FieldLabel className="gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
          <UsersIcon />
          Participants
        </FieldLabel>
        <SliderValue className="font-medium text-foreground text-xs tabular-nums" />
      </div>
    </Slider>
  );
};

const VolumeControls = () => {
  return (
    <Field className="w-full gap-5">
      <ParticipantsVolumeSlider />
      <PianoVolumeSlider />
    </Field>
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
