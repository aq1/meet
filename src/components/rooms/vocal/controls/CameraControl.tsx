import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { Group, GroupSeparator } from "#/components/ui/group";
import { Menu, MenuPopup, MenuTrigger } from "#/components/ui/menu";
import { MediaDeviceSelect } from "./MediaDeviceSelect";

const VideoMenu = ({
  variant,
}: {
  variant: "outline" | "destructive-outline";
}) => {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant={variant}
            size="icon-xl"
            className="w-7 lg:w-6"
            aria-label="Select camera"
            title="Select camera"
          />
        }
      >
        <ChevronUpIcon className="inline md:hidden" aria-hidden="true" />
        <ChevronDownIcon className="hidden md:inline" aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup side="top" sideOffset={14} align="end" className="w-72">
        <MediaDeviceSelect
          kind="videoinput"
          label="Camera"
          icon={<VideoIcon />}
        />
      </MenuPopup>
    </Menu>
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
