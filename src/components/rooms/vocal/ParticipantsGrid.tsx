import { TrackLoop, useTracks } from "@livekit/components-react";
import { ParticipantKind, Track } from "livekit-client";
import { Bird, Cat, Dog, Fish, Origami, Panda, Rabbit, Rat, Snail, Squirrel, Turtle } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { ParticipantTile } from "./ParticipantTile";

const icons = [Bird, Cat, Dog, Fish, Origami, Panda, Rabbit, Rat, Rat, Snail, Squirrel, Turtle];

const EmptyRoom = () => {
  const chooseIcon = () => icons[Math.floor(Math.random() * icons.length)];
  const [Icon, setIcon] = useState(chooseIcon);

  return (
    <Card className="size-full">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <div
              role="none"
              onMouseLeave={() => setIcon(chooseIcon())}
              className="transition-transform hover:scale-125"
            >
              <Icon />
            </div>
          </EmptyMedia>
          <EmptyTitle>{m.no_one_in_room()}</EmptyTitle>
          <EmptyDescription>{m.room_waiting_for_others()}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </Card>
  );
};

export const ParticipantsGrid = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  ).filter(
    (t) =>
      (!t.participant.isLocal || t.source === Track.Source.ScreenShare) &&
      t.participant.kind !== ParticipantKind.EGRESS,
  );

  const gridProps = (length: number) => {
    if (length <= 1) {
      return "grid-cols-1 grid-rows-1";
    }
    if (length === 2) {
      return "grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1";
    }
    if (length === 4) {
      return "grid-cols-2 grid-rows-2";
    }
    return "grid-cols-3 grid-rows-3";
  };

  if (!tracks.length) {
    return <EmptyRoom />;
  }

  return (
    <div className="relative size-full flex justify-center items-center">
      <div className={cn("size-full grid gap-2 place-items-center", gridProps(tracks.length))}>
        <TrackLoop tracks={tracks}>
          <ParticipantTile />
        </TrackLoop>
      </div>
    </div>
  );
};
