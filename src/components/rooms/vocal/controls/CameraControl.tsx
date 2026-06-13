import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { Field } from "#/components/ui/field";
import { Group, GroupSeparator } from "#/components/ui/group";
import { Popover, PopoverPopup, PopoverTrigger } from "#/components/ui/popover";
import { useIsMobile } from "#/hooks/use-media-query";
import { MediaDeviceSelect } from "./MediaDeviceSelect";

const CameraSettings = () => {
  return (
    <Field>
      <MediaDeviceSelect kind="videoinput" label="Camera" />
    </Field>
  );
};

const VideoMenu = ({
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
            aria-label="Select camera"
            title="Select camera"
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
        <CameraSettings />
      </PopoverPopup>
    </Popover>
  );
};

export const CameraControl = () => {
  const { enabled, pending, toggle } = useTrackToggle({
    source: Track.Source.Camera,
  });
  const variant = enabled ? "outline" : "destructive-outline";

  return (
    <Group aria-label="Camera controls">
      <Button
        disabled={pending}
        onClick={() => toggle()}
        variant={variant}
        size="icon-xl"
        title={enabled ? "Turn off camera" : "Turn on camera"}
      >
        {enabled ? <VideoIcon /> : <VideoOffIcon />}
      </Button>
      <GroupSeparator />
      <VideoMenu variant={variant} />
    </Group>
  );
};
