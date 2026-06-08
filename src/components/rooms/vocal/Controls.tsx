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
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { useControls } from "./controls-state";
import { useSynth } from "./Synth";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { useIsMobile } from "#/hooks/use-media-query";
import { Popover, PopoverPopup, PopoverTitle, PopoverTrigger } from "#/components/ui/popover";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { Slider, SliderValue } from "#/components/ui/slider";

const DeviceSelect = () => {
  const { devices, selectedDevice, setSelectedDevice } = useSynth();

  const items = devices.map((d) => ({ label: d.name, value: d }));

  return (
    <Select aria-label="Select MIDI" items={items} onValueChange={setSelectedDevice} value={selectedDevice}>
      <SelectTrigger disabled>
        <SelectValue placeholder={items.length ? "Select MIDI" : "No MIDI detected"} />
      </SelectTrigger>
      <SelectPopup>
        {items.map(({ label, value }) => (
          <SelectItem key={value.id} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>);
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

  return <Button
    onClick={() => controls.toggle("showKeyboard")}
    variant={controls.showKeyboard ? "default" : "outline"}
    size="icon-xl"
  >
    <PianoIcon />
  </Button>

}

const ChatToggle = () => {
  const controls = useControls();

  return <Button
    onClick={() => controls.toggle("showChat")}
    variant={controls.showChat ? "default" : "outline"}
    size="icon-xl"
  >
    <MessageCircleIcon />
  </Button>
}


const VolumeControls = () => {
  return <div className="flex flex-col gap-4 w-full">
    <Slider defaultValue={50}>
      <div className="mb-2 flex items-center justify-between gap-1">
        <FieldLabel className="font-medium text-sm">Microphone</FieldLabel>
        <SliderValue />
      </div>
    </Slider>
    <Slider defaultValue={50}>
      <div className="mb-2 flex items-center justify-between gap-1">
        <FieldLabel className="font-medium text-sm">Piano</FieldLabel>
        <SliderValue />
      </div>
    </Slider>
  </div>
}

const SettingsPopover = () => {
  return <Popover>
    <PopoverTrigger render={<Button variant="outline" size="icon-xl" />}>
      <Settings />
    </PopoverTrigger>
    <PopoverPopup className="w-80">
      <div className="flex flex-col gap-6">
        <PopoverTitle className="text-base">Settings</PopoverTitle>
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>MIDI</FieldLabel>
            <DeviceSelect />
            <FieldDescription></FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Volume</FieldLabel>
            <VolumeControls />
            <FieldDescription></FieldDescription>
          </Field>
        </div>
      </div>
    </PopoverPopup>
  </Popover>
}


const LeaveButton = () => {
  const isMobile = useIsMobile()

  return <Button onClick={() => { }} variant="destructive-outline" size={isMobile ? "icon-xl" : "xl"}>
    <PhoneOff />
    {isMobile ? null : <span>Leave</span>}
  </Button >
}

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
