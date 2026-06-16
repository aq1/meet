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
import { Group, GroupSeparator } from "#/components/ui/group";
import {
  Menu,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "#/components/ui/menu";
import { MediaDeviceSelect } from "./MediaDeviceSelect";

const MicMenu = ({
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
            className="w-7 md:w-6"
            aria-label="Select microphone"
            title="Select microphone"
          />
        }
      >
        <ChevronUpIcon className="inline md:hidden" aria-hidden="true" />
        <ChevronDownIcon className="hidden md:inline" aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup side="top" sideOffset={14} align="end" className="w-72">
        <MediaDeviceSelect
          kind="audioinput"
          label="Microphone"
          icon={<MicIcon />}
        />
        <MenuSeparator />
        <MediaDeviceSelect
          kind="audiooutput"
          label="Speaker"
          icon={<VolumeIcon />}
        />
      </MenuPopup>
    </Menu>
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
