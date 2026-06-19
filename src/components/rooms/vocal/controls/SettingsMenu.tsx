import { PianoIcon, Settings, UsersIcon } from "lucide-react";
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
import { Separator } from "#/components/ui/separator";
import { Slider } from "#/components/ui/slider";
import { useParticipantVolume } from "../controls-state";
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
  const volume = useParticipantVolume((state) => state.volume);
  const setVolume = useParticipantVolume((state) => state.setVolume);

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
        <VolumeControls />
        <Separator />
      </PopoverPopup>
    </Popover>
  );
};
