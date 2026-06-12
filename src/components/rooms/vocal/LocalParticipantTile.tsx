import {
  ParticipantName,
  TrackLoop,
  TrackRefContext,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Badge } from "#/components/ui/badge";
import { Card } from "#/components/ui/card";

export const LocalParticipantTile = () => {
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false },
  ).filter((t) => t.participant.isLocal);

  return (
    <TrackLoop tracks={tracks}>
      <TrackRefContext.Consumer>
        {(trackRef) => (
          <Card className="relative flex flex-col gap-1 size-full items-center overflow-hidden rounded-xl bg-muted">
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
    </TrackLoop>
  );
};
