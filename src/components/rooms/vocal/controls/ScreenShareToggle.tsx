import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { ScreenShareIcon, ScreenShareOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

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
      title={enabled ? m.controls_stop_sharing_screen() : m.controls_share_screen()}
      className="hidden lg:flex"
    >
      {enabled ? <ScreenShareOffIcon /> : <ScreenShareIcon />}
    </Button>
  );
};
