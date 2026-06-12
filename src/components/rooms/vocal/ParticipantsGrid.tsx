import {
  GridLayout,
  ParticipantName,
  TrackRefContext,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Badge } from "#/components/ui/badge";
import { Card } from "#/components/ui/card";

export const ParticipantsGrid = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  ).filter((t) => !t.participant.isLocal);

  return (
    <GridLayout
      tracks={tracks}
      className="grid size-full gap-1 rounded-xl bg-muted auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))]"
    >
      <TrackRefContext.Consumer>
        {(trackRef) => (
          <Card className="relative flex flex-col gap-1 size-full items-center overflow-hidden">
            {trackRef?.publication ? (
              <VideoTrack
                trackRef={trackRef}
                className="min-h-0 w-full flex-1 object-fit"
              />
            ) : (
              <div className="min-h-0 w-full flex-1 bg-muted" />
            )}
            <Badge className="absolute right-2 bottom-2">
              <ParticipantName />
            </Badge>
          </Card>
        )}
      </TrackRefContext.Consumer>
    </GridLayout>
  );
};
