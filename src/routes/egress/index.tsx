import {
  GridLayout,
  RoomAudioRenderer,
  RoomContext,
  useTracks,
} from "@livekit/components-react";
import { createFileRoute } from "@tanstack/react-router";
import { type DisconnectReason, Room, RoomEvent, Track } from "livekit-client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Chat } from "#/components/chat/Chat";
import { useControls } from "#/components/rooms/vocal/controls/controls-state";
import { ParticipantTile } from "#/components/rooms/vocal/ParticipantTile";
import { usePiano } from "#/components/rooms/vocal/piano/usePiano";

export const Route = createFileRoute("/egress/")({
  validateSearch: z.object({
    url: z.string(),
    token: z.string(),
    layout: z.string().optional(),
  }),
  component: EgressPage,
});

const Grid = () => {
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
      className="grid size-full grid-cols-[repeat(var(--lk-col-count),1fr)] grid-rows-[repeat(var(--lk-row-count),1fr)] gap-1 rounded-xl bg-muted"
    >
      <ParticipantTile />
    </GridLayout>
  );
};

const PianoSound = () => {
  usePiano({ midi: false });
  return null;
};

function EgressPage() {
  const { url, token } = Route.useSearch();
  const setControls = useControls((state) => state.set);
  const [room] = useState(
    () => new Room({ adaptiveStream: false, dynacast: false }),
  );

  useEffect(() => {
    setControls("showChat", true);
  }, [setControls]);

  useEffect(() => {
    const onDisconnected = (reason?: DisconnectReason) => {
      console.log("END_RECORDING", reason);
    };
    room
      .connect(url, token)
      .then(() => {
        room.once(RoomEvent.Disconnected, onDisconnected);
        console.log("START_RECORDING");
      })
      .catch((e) => console.error("egress: room.connect failed", url, e));
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.disconnect();
    };
  }, [room, url, token]);

  return (
    <RoomContext.Provider value={room}>
      <RoomAudioRenderer />
      <PianoSound />
      <div className="flex h-dvh w-dvw gap-2 p-4">
        <Grid />
        <Chat />
      </div>
    </RoomContext.Provider>
  );
}
