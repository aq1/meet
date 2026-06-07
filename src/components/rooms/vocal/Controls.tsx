import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  MessageCircleIcon,
  MicIcon,
  MicOffIcon,
  PhoneOff,
  PianoIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { useUser } from "#/lib/user-store";
import { useControls } from "./controls-state";
import { useSynth } from "./Synth";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

const DeviceSelect = () => {
  const { devices, selectedDevice, setSelectedDevice } = useSynth();

  const items = devices.map((d) => ({ label: d.name, value: d }));

  if (!devices.length) {
    return null;
  }

  return (
    <Select onValueChange={(v) => setSelectedDevice(v)} aria-label="Select Midi device" value={selectedDevice} items={items}>
      <SelectTrigger>
        <SelectValue placeholder="Select MIDI device" >
          {(item) => item?.name}
        </SelectValue>
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

export const Controls = () => {
  const controls = useControls();
  const username = useUser((state) => state.username);

  return (
    <div className="flex justify-between items-center px-6">
      <div className="flex gap-6">
        <span>@{username}</span>
      </div>
      <div className="w-full h-full flex justify-end items-center gap-6">
        <div>
          <DeviceSelect />
        </div>
        <MicToggle />
        <CameraToggle />
        <Button
          onClick={() => controls.toggle("showKeyboard")}
          variant={controls.showKeyboard ? "default" : "outline"}
          size="icon-xl"
        >
          <PianoIcon />
        </Button>
        <Button
          onClick={() => controls.toggle("showChat")}
          variant={controls.showChat ? "default" : "outline"}
          size="icon-xl"
        >
          <MessageCircleIcon />
        </Button>
        <Separator orientation="vertical" />
        <Button onClick={() => { }} variant="destructive-outline" size="xl">
          <PhoneOff />
          <span>Leave</span>
        </Button>
      </div>
    </div>
  );
};
