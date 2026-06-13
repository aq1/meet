import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { ScreenShareIcon, ScreenShareOffIcon } from "lucide-react";
import { Button } from "#/components/ui/button";

export const ScreenShareToggle = () => {
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
