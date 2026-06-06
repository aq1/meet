import { Chat } from "#/components/chat/Chat";
import { ParticipantVideoTile } from "#/components/participant-video-tile/ParticipantVideoTile";
import { useEffect, useState } from "react";
import { Controls } from "./Controls";
import { useControls } from "./controls-state";
import { Piano } from "./Piano";
import { RoomContext } from "@livekit/components-react";
import { Room } from "livekit-client";

import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useUser } from "#/lib/user-store";
import { grantLivekitToken } from "#/lib/livekit";

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
  const grant = useServerFn(grantToken);
  const username = useUser((state) => state.username);

  useEffect(() => {
    const connect = async () => {
      const { wss, token } = await grant({ data: { username } });
      await room.connect(wss, token);
      // await room.localParticipant.enableCameraAndMicrophone();
    };

    connect();

    return () => {
      room.disconnect();
    };
  }, [username, grant]);

  return (
    <RoomContext.Provider value={room}>
      <div className="h-dvh w-dvw pt-4">
        <div className="size-full flex flex-col gap-4">
          <div>
            <Controls />
          </div>
          <div className="size-full flex basis-full min-h-0">
            <div className="relative flex-1">
              <ParticipantVideoTile />
              <div className="absolute bottom-4 left-4 z-10 h-1/4 max-h-48 w-1/4 max-w-64">
                <ParticipantVideoTile isLocal />
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
