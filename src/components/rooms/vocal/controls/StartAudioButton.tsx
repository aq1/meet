import { useRoomContext, useStartAudio } from "@livekit/components-react";
import { Volume2Icon } from "lucide-react";
import { Button } from "#/components/ui/button";

export const StartAudioButton = () => {
  const room = useRoomContext();
  const { mergedProps } = useStartAudio({ room, props: {} });

  return (
    <Button
      {...mergedProps}
      variant="default"
      size="icon-xl"
      title="Start audio"
    >
      <Volume2Icon />
    </Button>
  );
};
