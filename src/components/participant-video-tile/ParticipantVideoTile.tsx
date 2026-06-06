import { Card } from "../ui/card";
import {
  ParticipantName,
  TrackLoop,
  TrackRefContext,
  VideoTrack,
  useTracks,
} from "@livekit/components-react";

import { Track } from "livekit-client";
import { Badge } from "../ui/badge";
export const ParticipantVideoTile = ({
  isLocal = false,
}: {
  isLocal?: boolean;
}) => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  ).filter((t) => t.participant.isLocal === isLocal);

  return (
    <div className="size-full grid gap-1">
      <TrackLoop tracks={tracks}>
        <TrackRefContext.Consumer>
          {(trackRef) => (
            <Card className="relative flex flex-col gap-1 size-full items-center overflow-hidden">
              {trackRef?.publication ? (
                <VideoTrack
                  trackRef={trackRef}
                  className="min-h-0 w-full flex-1 object-cover"
                />
              ) : (
                <div className="min-h-0 w-full flex-1 bg-muted" />
              )}
              <Badge className="absolute right-4 bottom-4">
                <ParticipantName />
              </Badge>
            </Card>
          )}
        </TrackRefContext.Consumer>
      </TrackLoop>
    </div>
  );
};
