import { RoomAudioRenderer } from "@livekit/components-react";
import { useControls } from "./controls/controls-state";
import { LocalParticipantTile } from "./LocalParticipantTile";
import { ParticipantsGrid } from "./ParticipantsGrid";

export const Participants = () => {
  const participantVolume = useControls((state) => state.volume);

  return (
    <div className="relative flex-1">
      <RoomAudioRenderer volume={participantVolume / 100} />
      <ParticipantsGrid />
      <LocalParticipantTile />
    </div>
  );
};
