import { Button } from "#/components/ui/button";
import { useControls } from "./controls-state";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  PianoIcon,
  MessageCircleIcon,
  PhoneOff,
} from "lucide-react";
import { Separator } from "#/components/ui/separator";
import { useUser } from "#/lib/user-store";
import { Track } from "livekit-client";
import { useTrackToggle } from "@livekit/components-react";

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
        <Button onClick={() => {}} variant="destructive-outline" size="xl">
          <PhoneOff />
          <span>Leave</span>
        </Button>
      </div>
    </div>
  );
};
