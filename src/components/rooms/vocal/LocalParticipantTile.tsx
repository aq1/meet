import { TrackLoop, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { ParticipantTile } from "./ParticipantTile";

export const LocalParticipantTile = () => {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false }).filter(
    (t) => t.participant.isLocal && !t.publication.isMuted,
  );

  if (!tracks.length) return null;

  return (
    <div className="absolute bottom-4 left-4 z-10 aspect-video max-h-48 w-1/4 max-w-64">
      <TrackLoop tracks={tracks}>
        <ParticipantTile />
      </TrackLoop>
    </div>
  );
};
