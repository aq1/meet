import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { ChevronDownIcon, ChevronUpIcon, MicIcon, MicOffIcon, VolumeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Group, GroupSeparator } from "@/components/ui/group";
import { Menu, MenuPopup, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { m } from "@/paraglide/messages";
import { MediaDeviceSelect } from "./MediaDeviceSelect";

const MicMenu = ({ variant }: { variant: "outline" | "destructive-outline" }) => {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant={variant}
            size="icon-xl"
            className="w-7 lg:w-6"
            aria-label={m.controls_select_microphone()}
            title={m.controls_select_microphone()}
          />
        }
      >
        <ChevronUpIcon className="inline lg:hidden" aria-hidden="true" />
        <ChevronDownIcon className="hidden lg:inline" aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup side="top" sideOffset={14} align="end" className="w-72">
        <MediaDeviceSelect
          kind="audioinput"
          label={m.device_microphone()}
          emptyLabel={m.device_no_microphone()}
          icon={<MicIcon />}
        />
        <MenuSeparator />
        <MediaDeviceSelect
          kind="audiooutput"
          label={m.device_speaker()}
          emptyLabel={m.device_no_speaker()}
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
    <Group aria-label={m.controls_microphone_group()}>
      <Button
        disabled={pending}
        onClick={() => toggle()}
        variant={variant}
        size="icon-xl"
        title={enabled ? m.controls_mute_microphone() : m.controls_unmute_microphone()}
      >
        {enabled ? <MicIcon /> : <MicOffIcon />}
      </Button>
      <GroupSeparator />
      <MicMenu variant={variant} />
    </Group>
  );
};
