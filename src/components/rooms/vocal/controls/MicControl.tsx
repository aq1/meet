import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MicIcon,
  MicOffIcon,
  VolumeIcon,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { Field, FieldLabel } from "#/components/ui/field";
import { Group, GroupSeparator } from "#/components/ui/group";
import { Popover, PopoverPopup, PopoverTrigger } from "#/components/ui/popover";
import { useIsMobile } from "#/hooks/use-media-query";
import { MediaDeviceSelect } from "./MediaDeviceSelect";

const AudioSettings = () => {
  return (
    <div className="flex flex-col gap-3">
      <Field>
        <FieldLabel className="gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
          <MicIcon />
          Microphone
        </FieldLabel>
        <MediaDeviceSelect kind="audioinput" label="Microphone" />
      </Field>
      <Field>
        <FieldLabel className="gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
          <VolumeIcon />
          Speaker
        </FieldLabel>
        <MediaDeviceSelect kind="audiooutput" label="Speaker" />
      </Field>
    </div>
  );
};

const MicMenu = ({
  variant,
}: {
  variant: "outline" | "destructive-outline";
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
            aria-label="Select microphone"
            title="Select microphone"
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
        <AudioSettings />
      </PopoverPopup>
    </Popover>
  );
};

export const MicControl = () => {
  const { enabled, pending, toggle } = useTrackToggle({
    source: Track.Source.Microphone,
  });
  const variant = enabled ? "outline" : "destructive-outline";

  return (
    <Group aria-label="Microphone controls">
      <Button
        disabled={pending}
        onClick={() => toggle()}
        variant={variant}
        size="icon-xl"
        title={enabled ? "Mute microphone" : "Unmute microphone"}
      >
        {enabled ? <MicIcon /> : <MicOffIcon />}
      </Button>
      <GroupSeparator />
      <MicMenu variant={variant} />
    </Group>
  );
};
