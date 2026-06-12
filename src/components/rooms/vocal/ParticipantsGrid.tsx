import { GridLayout, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { ParticipantTile } from "./ParticipantTile";

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
      <ParticipantTile />
    </GridLayout>
  );
};
