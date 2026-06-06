import { Card } from "../ui/card";
import {
  ParticipantLoop,
  ParticipantName,
  ParticipantTile,
  useParticipants,
} from "@livekit/components-react";

export const ParticipantVideoTile = ({ isLocal }: { isLocal?: boolean }) => {
  const participants = useParticipants().filter((p) => p.isLocal === isLocal);

  return (
    <div className="size-full grid gap-1">
      <ParticipantLoop participants={participants}>
        <Card className="flex flex-col gap-1 size-full items-center">
          <ParticipantTile />
          <ParticipantName />
        </Card>
      </ParticipantLoop>
    </div>
  );
};
