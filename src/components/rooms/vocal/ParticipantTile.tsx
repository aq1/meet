import {
  ParticipantName,
  TrackRefContext,
  type TrackReferenceOrPlaceholder,
  useIsMuted,
  VideoTrack,
} from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { Track } from "livekit-client";
import { MicOff, VideoOff } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Card } from "#/components/ui/card";
import { cn } from "#/lib/utils";

const MicMutedIndicator = ({ participant }: { participant: Participant }) => {
  const isMuted = useIsMuted({ participant, source: Track.Source.Microphone });
  if (!isMuted) return null;
  return <MicOff className="size-3" aria-label="Microphone muted" />;
};

const ParticipantTileContent = ({
  trackRef,
}: {
  trackRef: TrackReferenceOrPlaceholder;
}) => {
  const isCameraMuted = useIsMuted(trackRef);
  const hasVideo = !!trackRef.publication && !isCameraMuted;
  // Mirror only the local camera self-view (display-only, like a mirror).
  // Remote video and screen share must never be flipped.
  const isMirrored =
    trackRef.participant?.isLocal && trackRef.source === Track.Source.Camera;

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-1 size-full items-center overflow-hidden rounded-xl",
        hasVideo ? "bg-muted" : "bg-transparent",
      )}
    >
      {hasVideo ? (
        <VideoTrack
          trackRef={trackRef}
          className={cn(
            "min-h-0 w-full flex-1 object-fit",
            isMirrored && "-scale-x-100",
          )}
        />
      ) : (
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <VideoOff className="size-8 text-muted-foreground" />
        </div>
      )}
      <Badge className="absolute right-2 bottom-2 flex items-center gap-1">
        {trackRef.participant && (
          <MicMutedIndicator participant={trackRef.participant} />
        )}
        <ParticipantName />
      </Badge>
    </Card>
  );
};

export const ParticipantTile = () => (
  <TrackRefContext.Consumer>
    {(trackRef) =>
      trackRef ? <ParticipantTileContent trackRef={trackRef} /> : null
    }
  </TrackRefContext.Consumer>
);
