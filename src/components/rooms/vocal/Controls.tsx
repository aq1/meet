import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  MessageCircleIcon,
  MicIcon,
  MicOffIcon,
  PhoneOff,
  PianoIcon,
  Settings,
  VideoIcon,
  VideoOffIcon,
  Volume2Icon,
} from "lucide-react";
import { useState } from "react";
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
import { useControls } from "./controls-state";
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
    >
      {enabled ? <VideoIcon /> : <VideoOffIcon />}
    </Button>
  );
};

const PianoToggle = () => {
  const controls = useControls();

  return (
    <Button
      onClick={() => controls.toggle("showKeyboard")}
      variant={controls.showKeyboard ? "default" : "outline"}
      size="icon-xl"
    >
      <PianoIcon />
    </Button>
  );
};

const ChatToggle = () => {
  const controls = useControls();

  return (
    <Button
      onClick={() => controls.toggle("showChat")}
      variant={controls.showChat ? "default" : "outline"}
      size="icon-xl"
    >
      <MessageCircleIcon />
    </Button>
  );
};

const VolumeSlider = ({
  icon,
  label,
  defaultValue,
}: {
  icon: React.ReactNode;
  label: string;
  defaultValue: number;
}) => {
  return (
    <Slider defaultValue={defaultValue}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <FieldLabel className="gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
          {icon}
          {label}
        </FieldLabel>
        <SliderValue className="font-medium text-foreground text-xs tabular-nums" />
      </div>
    </Slider>
  );
};

const VolumeControls = () => {
  return (
    <Field className="w-full gap-5">
      <VolumeSlider icon={<MicIcon />} label="Microphone" defaultValue={50} />
      <VolumeSlider icon={<PianoIcon />} label="Piano" defaultValue={50} />
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant={open ? "default" : "outline"} size="icon-xl" />
        }
      >
        <Settings />
      </PopoverTrigger>
      <PopoverPopup sideOffset={14} className="w-84">
        <div className="flex flex-col gap-5">
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

  return (
    <Button
      onClick={() => {}}
      variant="destructive-outline"
      size={isMobile ? "icon-xl" : "xl"}
    >
      <PhoneOff />
      {isMobile ? null : <span>Leave</span>}
    </Button>
  );
};

export const Controls = () => {
  return (
    <div className="flex items-center px-6">
      <div className="w-full h-full flex justify-end items-center gap-6">
        <MicToggle />
        <CameraToggle />
        <PianoToggle />
        <ChatToggle />
        <SettingsPopover />
        <Separator orientation="vertical" />
        <LeaveButton />
      </div>
    </div>
  );
};
