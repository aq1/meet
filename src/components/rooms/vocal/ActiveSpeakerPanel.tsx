import {
  TrackRefContext,
  useSpeakingParticipants,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { ParticipantTile } from "./ParticipantTile";

export const ActiveSpeakerPanel = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  ).filter((t) => !t.participant.isLocal);

  const speakers = useSpeakingParticipants();
  const [activeIdentity, setActiveIdentity] = useState<string | undefined>();

  useEffect(() => {
    const loudest = speakers[0];
    if (loudest) setActiveIdentity(loudest.identity);
  }, [speakers]);

  const screenShareTrack = tracks.find(
    (t) => t.source === Track.Source.ScreenShare,
  );
  const activeTrack =
    screenShareTrack ??
    tracks.find(
      (t) =>
        t.participant.identity === activeIdentity &&
        t.source === Track.Source.Camera,
    ) ??
    tracks.find((t) => t.source === Track.Source.Camera) ??
    tracks[0];

  if (!activeTrack) {
    return (
      <div className="flex size-full items-center justify-center rounded-xl bg-muted text-muted-foreground text-sm">
        Waiting for others to join…
      </div>
    );
  }

  return (
    <div className="size-full overflow-hidden rounded-xl bg-muted">
      <TrackRefContext.Provider value={activeTrack}>
        <ParticipantTile />
      </TrackRefContext.Provider>
    </div>
  );
};
