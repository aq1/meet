import { useRoomContext, useStartAudio, useStartVideo } from "@livekit/components-react";
import { Button } from "#/components/ui/button";

export const StartAudioButton = () => {
  const room = useRoomContext();
  const { mergedProps: { onClick: OnStartAudio } } = useStartAudio({ room, props: {} });
  const { mergedProps: { onClick: OnStartVideo } } = useStartVideo({ room, props: {} });

  return (
    <>
      <Button
        onClick={OnStartAudio}
        variant="default"
        size="icon-xl"
        title="Start audio"
      >
        Audio
      </Button>
      <Button
        onClick={OnStartVideo}
        variant="default"
        size="icon-xl"
        title="Start audio"
      >
        Video
      </Button>
    </>
  );
};
