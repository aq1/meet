import {
  useMediaDeviceSelect,
  useRoomContext,
  useTrackToggle,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
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
  Volume2Icon,
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
  kind: "audioinput" | "videoinput";
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

const MicToggle = () => {
  const { enabled, pending, toggle } = useTrackToggle({
    source: Track.Source.Microphone,
  });

  return (
    <Button
      disabled={pending}
      onClick={() => toggle()}
      variant={enabled ? "outline" : "destructive-outline"}
      size="icon-xl"
      title={enabled ? "Mute microphone" : "Unmute microphone"}
    >
      {enabled ? <MicIcon /> : <MicOffIcon />}
    </Button>
  );
};

const CameraToggle = () => {
  const { enabled, pending, toggle } = useTrackToggle({
    source: Track.Source.Camera,
  });

  return (
    <Button
      disabled={pending}
      onClick={() => toggle()}
      variant={enabled ? "outline" : "destructive-outline"}
      size="icon-xl"
      title={enabled ? "Turn off camera" : "Turn on camera"}
    >
      {enabled ? <VideoIcon /> : <VideoOffIcon />}
    </Button>
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

const PianoToggle = () => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);

  return (
    <Button
      onClick={() => toggle("showKeyboard")}
      variant={showKeyboard ? "default" : "outline"}
      size="icon-xl"
      title={showKeyboard ? "Hide piano" : "Show piano"}
    >
      <PianoIcon />
    </Button>
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

const SettingsSection = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 font-medium text-muted-foreground text-xs uppercase tracking-wider [&_svg]:size-3.5">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
};

const SettingsPopover = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (eventDetails.reason === "outside-press") return;
        setOpen(nextOpen);
      }}
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
        <div className="flex flex-col gap-5">
          <SettingsSection icon={<MicIcon />} title="Microphone">
            <Field>
              <MediaDeviceSelect kind="audioinput" label="Microphone" />
            </Field>
          </SettingsSection>

          <Separator />

          <SettingsSection icon={<VideoIcon />} title="Camera">
            <Field>
              <MediaDeviceSelect kind="videoinput" label="Camera" />
            </Field>
          </SettingsSection>

          <Separator />

          <SettingsSection icon={<PianoIcon />} title="MIDI Device">
            <Field>
              <DeviceSelect />
              <FieldDescription>
                Connect a MIDI keyboard to play along.
              </FieldDescription>
            </Field>
          </SettingsSection>

          <Separator />

          <SettingsSection icon={<Volume2Icon />} title="Volume">
            <VolumeControls />
          </SettingsSection>
        </div>
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
        <MicToggle />
        <CameraToggle />
        {isMobile ? null : <ScreenShareToggle />}
        <PianoToggle />
        <ChatToggle />
        <SettingsPopover />
        <Separator orientation="vertical" />
        <LeaveButton />
      </div>
    </div>
  );
};
