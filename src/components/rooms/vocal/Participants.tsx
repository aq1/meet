import { RoomAudioRenderer } from "@livekit/components-react";
import { useIsMobile } from "#/hooks/use-media-query";
import { ActiveSpeakerPanel } from "./ActiveSpeakerPanel";
import { useControls } from "./controls/controls-state";
import { LocalParticipantTile } from "./LocalParticipantTile";
import { ParticipantsGrid } from "./ParticipantsGrid";

export const Participants = () => {
  const isMobile = useIsMobile();
  const participantVolume = useControls((state) => state.volume);

  return (
    <div className="relative flex-1">
      <RoomAudioRenderer volume={participantVolume / 100} />
      {isMobile ? <ActiveSpeakerPanel /> : <ParticipantsGrid />}
      <div className="absolute bottom-4 left-4 z-10 h-1/4 max-h-48 w-1/4 max-w-64">
        <LocalParticipantTile />
      </div>
    </div>
  );
};
