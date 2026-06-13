import {
  useMediaDeviceSelect,
  useRoomContext,
  useTrackToggle,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  ChevronUpIcon,
  MessageCircleIcon,
  MicIcon,
  MicOffIcon,
  PhoneOff,
  PianoIcon,
  ScreenShareIcon,
  ScreenShareOffIcon,
  Settings,
  UsersIcon,
  VideoIcon,
  VideoOffIcon,
  VolumeIcon,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { Group, GroupSeparator } from "#/components/ui/group";
import { Popover, PopoverPopup, PopoverTrigger } from "#/components/ui/popover";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Separator } from "#/components/ui/separator";
import { Slider, SliderValue } from "#/components/ui/slider";
import { useIsMobile } from "#/hooks/use-media-query";
import { useControls, useParticipantVolume } from "./controls-state";
import { useSynth } from "./Synth";

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

const MediaDeviceSelect = ({
  kind,
  label,
}: {
  kind: "audioinput" | "videoinput" | "audiooutput";
  label: string;
}) => {
  const { devices, activeDeviceId, setActiveMediaDevice } =
    useMediaDeviceSelect({ kind, requestPermissions: true });

  const items = devices
    .filter((d) => d.deviceId)
    .map((d, index) => ({
      label: d.label || `${label} ${index + 1}`,
      value: d.deviceId,
    }));

  return (
    <Select
      aria-label={`Select ${label.toLowerCase()}`}
      items={items}
      onValueChange={(value) => {
        if (value) setActiveMediaDevice(value);
      }}
      value={activeDeviceId}
    >
      <SelectTrigger disabled={!items.length}>
        <SelectValue
          placeholder={
            items.length
              ? `Select ${label.toLowerCase()}`
              : `No ${label.toLowerCase()} detected`
          }
        />
      </SelectTrigger>
      <SelectPopup>
        {items.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
};

const MicMenu = ({
  variant,
}: {
  variant: "outline" | "destructive-outline";
}) => {

  return (
    <Popover
    >
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
        <ChevronUpIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup side="top" sideOffset={14} align="end" className="w-72">
        <AudioSettings />
      </PopoverPopup>
    </Popover>
  );
};

const MicControl = () => {
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
        <ChevronUpIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup side="top" sideOffset={14} align="end" className="w-72">
        <CameraSettings />
      </PopoverPopup>
    </Popover>
  );
};

const CameraControl = () => {
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

const ScreenShareToggle = () => {
  const { enabled, pending, toggle } = useTrackToggle({
    source: Track.Source.ScreenShare,
  });

  return (
    <Button
      disabled={pending}
      onClick={() => toggle()}
      variant={enabled ? "default" : "outline"}
      size="icon-xl"
      title={enabled ? "Stop sharing screen" : "Share screen"}
    >
      {enabled ? <ScreenShareOffIcon /> : <ScreenShareIcon />}
    </Button>
  );
};

const MidiSettings = () => {
  return (
    <Field>
      <DeviceSelect />
      <FieldDescription>
        Connect a MIDI keyboard to play along.
      </FieldDescription>
    </Field>
  );
};

const MidiMenu = ({
  variant,
}: {
  variant: "default" | "outline";
}) => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={variant}
            size="icon-xl"
            className="w-7 sm:w-6"
            aria-label="Select MIDI device"
            title="Select MIDI device"
          />
        }
      >
        <ChevronUpIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup side="top" sideOffset={14} align="end" className="w-72">
        <MidiSettings />
      </PopoverPopup>
    </Popover>
  );
};

const PianoControl = () => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);
  const variant = showKeyboard ? "default" : "outline";

  return (
    <Group aria-label="Piano controls">
      <Button
        onClick={() => toggle("showKeyboard")}
        variant={variant}
        size="icon-xl"
        title={showKeyboard ? "Hide piano" : "Show piano"}
      >
        <PianoIcon />
      </Button>
      <GroupSeparator />
      <MidiMenu variant={variant} />
    </Group>
  );
};

const ChatToggle = () => {
  const showChat = useControls((state) => state.showChat);
  const toggle = useControls((state) => state.toggle);

  return (
    <Button
      onClick={() => toggle("showChat")}
      variant={showChat ? "default" : "outline"}
      size="icon-xl"
      title={showChat ? "Hide chat" : "Show chat"}
    >
      <MessageCircleIcon />
    </Button>
  );
};

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

const SettingsPopover = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
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

const LeaveButton = () => {
  const isMobile = useIsMobile();
  const room = useRoomContext();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive-outline"
            size={isMobile ? "icon-xl" : "xl"}
            title="Leave"
          />
        }
      >
        <PhoneOff />
        {isMobile ? null : <span>Leave</span>}
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave the room?</AlertDialogTitle>
          <AlertDialogDescription>
            You'll be disconnected from this room. You can rejoin at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline">Cancel</Button>} />
          <AlertDialogClose
            render={<Button variant="destructive" />}
            onClick={() => room.disconnect()}
          >
            Leave
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
};

export const Controls = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex items-center border-t bg-background/80 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:static md:z-auto md:border-0 md:bg-transparent md:px-6 md:py-0 md:pb-0 md:backdrop-blur-none">
      <div className="w-full h-full flex justify-center items-center gap-3 md:justify-end md:gap-6">
        <MicControl />
        <CameraControl />
        {isMobile ? null : <ScreenShareToggle />}
        <PianoControl />
        <ChatToggle />
        <SettingsPopover />
        <Separator orientation="vertical" />
        <LeaveButton />
      </div>
    </div>
  );
};
