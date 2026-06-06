import { Chat } from "#/components/chat/Chat";
import { ParticipantVideoTile } from "#/components/participant-video-tile/ParticipantVideoTile";
import { useEffect, useState } from "react";
import { Controls } from "./Controls";
import { useControls } from "./controls-state";
import { Piano } from "./Piano";

import { useLivekit } from "./room-state";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { grantLivekitToken } from "#/lib/livekit";
import { useUser } from "#/lib/user-store";
import { RemoteTrack, RoomEvent, Track } from "livekit-client";

const grantToken = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => await grantLivekitToken(data.username));

export const VocalRoom = () => {
  const controls = useControls();
  const grant = useServerFn(grantToken);
  const livekit = useLivekit();
  const username = useUser((state) => state.username);
  const [track, setTrack] = useState<RemoteTrack | undefined>(undefined);

  useEffect(() => {
    if (livekit.room.state !== "disconnected") {
      return;
    }

    const connect = async () => {
      const { wss, token } = await grant({ data: { username } });
      livekit.room.connect(wss, token);
      livekit.room.localParticipant.enableCameraAndMicrophone();
      livekit.room.on(RoomEvent.TrackSubscribed, (t: RemoteTrack) => {
        setTrack(t);
      });
    };

    connect();

    return () => {
      livekit.room.disconnect();
    };
  }, [username, livekit.room, grant]);

  return (
    <div className="h-dvh w-dvw pt-4">
      <div className="size-full flex flex-col gap-4">
        <div>
          <Controls />
        </div>
        <div className="size-full flex basis-full min-h-0">
          <div className="flex-1">
            <ParticipantVideoTile track={track} />
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
  );
};
