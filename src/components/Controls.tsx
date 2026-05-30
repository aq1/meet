import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { useControls } from "./controls-state";
import { useLivekit } from "./room-state";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { grantLivekitToken } from "#/lib/livekit";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  PianoIcon,
  MessageCircleIcon,
  PowerIcon,
} from "lucide-react";

const grantToken = createServerFn({ method: "POST" }).handler(
  grantLivekitToken,
);

export const Controls = () => {
  const controls = useControls();
  const grant = useServerFn(grantToken);
  const livekit = useLivekit();

  const connect = async () => {
    if (livekit.room.state !== "disconnected") {
      return;
    }
    const { wss, token } = await grant();
    livekit.room.connect(wss, token);
  };

  return (
    <Card className="p-2">
      <div className="w-full h-full flex justify-center items-center gap-6 px-6">
        <Button
          onClick={() => controls.toggle("micOn")}
          variant={controls.micOn ? "outline" : "destructive-outline"}
          size="icon-lg"
          className="rounded-full"
        >
          {controls.micOn ? <MicIcon /> : <MicOffIcon />}
        </Button>
        <Button
          onClick={() => controls.toggle("cameraOn")}
          variant={controls.cameraOn ? "outline" : "destructive-outline"}
          size="icon-lg"
          className="rounded-full"
        >
          {controls.cameraOn ? <VideoIcon /> : <VideoOffIcon />}
        </Button>
        <Button
          onClick={() => controls.toggle("showKeyboard")}
          variant={controls.showKeyboard ? "outline" : "destructive-outline"}
          size="icon-lg"
          className="rounded-full"
        >
          <PianoIcon />
        </Button>
        <Button
          onClick={() => controls.toggle("showChat")}
          variant={controls.showChat ? "default" : "outline"}
          size="icon-lg"
          className="rounded-full"
        >
          <MessageCircleIcon />
        </Button>
        <Button
          onClick={() => {
            connect();
          }}
          variant="destructive-outline"
          size="icon-lg"
          className="rounded-full"
        >
          <PowerIcon />
        </Button>
      </div>
    </Card>
  );
};
