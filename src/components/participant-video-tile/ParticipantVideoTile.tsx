import { Card } from "../ui/card";
import {
  ParticipantName,
  TrackLoop,
  TrackRefContext,
  VideoTrack,
  useTracks,
} from "@livekit/components-react";

import { Track } from "livekit-client";
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
            <Card className="flex flex-col gap-1 size-full items-center">
              {trackRef?.publication ? (
                <VideoTrack
                  trackRef={trackRef}
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full bg-muted" />
              )}
              <ParticipantName />
            </Card>
          )}
        </TrackRefContext.Consumer>
      </TrackLoop>
    </div>
  );
};
