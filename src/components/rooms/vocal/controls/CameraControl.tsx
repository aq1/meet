import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { VideoIcon, VideoOffIcon } from "lucide-react";
import { Button } from "#/components/ui/button";

export const CameraControl = () => {
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
