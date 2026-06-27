import { useRoomContext, useStartAudio, useStartVideo } from "@livekit/components-react";
import { Button } from "#/components/ui/button";


export const StartVideoButton = () => {
  const room = useRoomContext();
  const { canPlayVideo, mergedProps } = useStartVideo({ room, props: {} });

  if (canPlayVideo) {
    return null
  }

  return <Button
    {...mergedProps}
    variant="default"
    size="icon-xl"
    title="Start audio"
  >
    Start Video
  </Button>
}

export const StartAudioButton = () => {
  const room = useRoomContext();
  const { canPlayAudio, mergedProps } = useStartAudio({ room, props: {} });

  if (canPlayAudio) {
    return null
  }

  return (
    <>
      <Button
        {...mergedProps}
        variant="default"
        size="icon-xl"
        title="Start audio"
      >
        Start Audio
      </Button>
    </>
  );
};
