import { RoomAudioRenderer, RoomContext } from "@livekit/components-react";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Room } from "livekit-client";
import { useEffect, useState } from "react";
import { Chat } from "#/components/chat/Chat";
import { grantLivekitToken } from "#/lib/livekit";
import { useUser } from "#/lib/user-store";
import { Controls } from "./Controls";
import { useControls, useParticipantVolume } from "./controls-state";
import { LocalParticipantTile } from "./LocalParticipantTile";
import { ParticipantsGrid } from "./ParticipantsGrid";
import { Piano } from "./Piano";

const grantToken = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => await grantLivekitToken(data.username));

export const VocalRoom = () => {
  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      }),
  );
  const controls = useControls();
  const participantVolume = useParticipantVolume((state) => state.volume);
  const grant = useServerFn(grantToken);
  const username = useUser((state) => state.username);

  useEffect(() => {
    const connect = async () => {
      if (!room || !username) {
        return;
      }
      const { wss, token } = await grant({ data: { username } });
      await room.connect(wss, token);
      await room.localParticipant.enableCameraAndMicrophone();
    };

    connect();

    return () => {
      room.disconnect();
    };
  }, [room, username, grant]);

  return (
    <RoomContext.Provider value={room}>
      <RoomAudioRenderer volume={participantVolume / 100} />
      <div className="h-dvh w-dvw pt-4">
        <div className="size-full flex flex-col gap-4">
          <div>
            <Controls />
          </div>
          <div className="size-full flex basis-full min-h-0">
            <div className="relative flex-1">
              <ParticipantsGrid />
              <div className="absolute bottom-4 left-4 z-10 h-1/4 max-h-48 w-1/4 max-w-64">
                <LocalParticipantTile />
              </div>
            </div>
            <div
              className={`flex basis-1/4 justify-end gap-4 min-h-0 ${
                controls.showChat ? "" : "hidden"
              }`}
            >
              <div className="size-full flex flex-col px-4 min-h-0">
                <Chat />
              </div>
            </div>
          </div>
          <div
            className={`w-full basis-1/3 ${controls.showKeyboard ? "" : "hidden"}`}
          >
            <Piano />
          </div>
        </div>
      </div>
    </RoomContext.Provider>
  );
};
