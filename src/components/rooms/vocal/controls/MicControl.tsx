import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { MicIcon, MicOffIcon } from "lucide-react";
import { Button } from "#/components/ui/button";

export const MicControl = () => {
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
