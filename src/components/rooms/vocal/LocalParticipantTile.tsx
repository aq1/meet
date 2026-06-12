import { TrackLoop, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { ParticipantTile } from "./ParticipantTile";

export const LocalParticipantTile = () => {
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false },
  ).filter((t) => t.participant.isLocal);

  return (
    <TrackLoop tracks={tracks}>
      <ParticipantTile />
    </TrackLoop>
  );
};
