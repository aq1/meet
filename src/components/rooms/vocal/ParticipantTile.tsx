import {
  ParticipantName,
  TrackRefContext,
  type TrackReferenceOrPlaceholder,
  useConnectionQualityIndicator,
  useIsMuted,
  useIsSpeaking,
  VideoTrack,
} from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { ConnectionQuality, Track } from "livekit-client";
import { MicOff, Signal, SignalHigh, SignalLow, SignalMedium, VideoOff } from "lucide-react";
import { type SyntheticEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

const MicMutedIndicator = ({ participant }: { participant: Participant }) => {
  const isMuted = useIsMuted({ participant, source: Track.Source.Microphone });
  if (!isMuted) return null;
  return <MicOff className="size-3" aria-label={m.room_microphone_muted()} />;
};

const ConnectionQualityIndicator = ({ participant }: { participant: Participant }) => {
  const { quality } = useConnectionQualityIndicator({ participant });

  switch (quality) {
    case ConnectionQuality.Excellent:
      return <SignalHigh className="size-3 text-emerald-500" aria-label={m.room_connection_excellent()} />;
    case ConnectionQuality.Good:
      return <SignalMedium className="size-3 text-yellow-500" aria-label={m.room_connection_good()} />;
    case ConnectionQuality.Poor:
      return <SignalLow className="size-3 text-red-500" aria-label={m.room_connection_poor()} />;
    case ConnectionQuality.Lost:
      return <Signal className="size-3 text-muted-foreground" aria-label={m.room_connection_lost()} />;
    default:
      return null;
  }
};

import { useFacingMode } from "@livekit/components-react";

const ParticipantTileContent = ({ trackRef }: { trackRef: TrackReferenceOrPlaceholder }) => {
  const isCameraMuted = useIsMuted(trackRef);
  const hasVideo = !!trackRef.publication && !isCameraMuted;
  const isSpeaking = useIsSpeaking(trackRef.participant);
  const facingMode = useFacingMode(trackRef);

  const [aspect, setAspect] = useState(16 / 9);

  const isMirrored = facingMode === "user" && trackRef.participant?.isLocal && trackRef.source === Track.Source.Camera;

  const updateAspect = (e: SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth && videoHeight) setAspect(videoWidth / videoHeight);
  };

  return (
    <div className="flex size-full min-h-0 min-w-0 items-center justify-center [container-type:size]">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-muted",
          "ring-2 ring-transparent transition-colors",
          isSpeaking && "ring-emerald-500",
        )}
        style={{ aspectRatio: aspect, width: `min(100cqw, 100cqh * ${aspect})` }}
      >
        {hasVideo ? (
          <VideoTrack
            trackRef={trackRef}
            onLoadedMetadata={updateAspect}
            onResize={updateAspect}
            className={cn("size-full object-cover", isMirrored && "-scale-x-100")}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <VideoOff className="size-8 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute right-2 bottom-2 flex items-center gap-1">
          {trackRef.participant && (
            <>
              <ConnectionQualityIndicator participant={trackRef.participant} />
              <MicMutedIndicator participant={trackRef.participant} />
            </>
          )}
          <ParticipantName />
        </Badge>
      </div>
    </div>
  );
};

export const ParticipantTile = () => (
  <TrackRefContext.Consumer>
    {(trackRef) => (trackRef ? <ParticipantTileContent trackRef={trackRef} /> : null)}
  </TrackRefContext.Consumer>
);
