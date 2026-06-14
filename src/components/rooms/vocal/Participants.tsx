import { useIsMobile } from "#/hooks/use-media-query";
import { ActiveSpeakerPanel } from "./ActiveSpeakerPanel";
import { LocalParticipantTile } from "./LocalParticipantTile";
import { ParticipantsGrid } from "./ParticipantsGrid";

export const Participants = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative flex-1">
      {isMobile ? <ActiveSpeakerPanel /> : <ParticipantsGrid />}
      <div className="absolute bottom-4 left-4 z-10 h-1/4 max-h-48 w-1/4 max-w-64">
        <LocalParticipantTile />
      </div>
    </div>
  );
};
