import { RoomAudioRenderer, RoomContext } from "@livekit/components-react";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Room } from "livekit-client";
import { useEffect, useState } from "react";
import { Chat } from "#/components/chat/Chat";
import { useIsMobile } from "#/hooks/use-media-query";
import { grantLivekitToken } from "#/lib/livekit";
import { useUser } from "#/lib/user-store";
import { ActiveSpeakerPanel } from "./ActiveSpeakerPanel";
import { Controls } from "./controls";
import { useControls, useParticipantVolume } from "./controls-state";
import { LocalParticipantTile } from "./LocalParticipantTile";
import { ParticipantsGrid } from "./ParticipantsGrid";
import { Piano } from "./Piano";

const grantToken = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; roomId: string }) => data)
  .handler(
    async ({ data }) => await grantLivekitToken(data.username, data.roomId),
  );

export const VocalRoom = ({ roomId }: { roomId: string }) => {
  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      }),
  );
  const showKeyboard = useControls((state) => state.showKeyboard);
  const isMobile = useIsMobile();
  const setShowChat = useControls((state) => state.set);
  const participantVolume = useParticipantVolume((state) => state.volume);
  const grant = useServerFn(grantToken);
  const username = useUser((state) => state.username);

  useEffect(() => {
    const connect = async () => {
      if (!room || !username) {
        return;
      }
      const { wss, token } = await grant({
        data: { username, roomId },
      });
      await room.connect(wss, token);
      await room.localParticipant.enableCameraAndMicrophone();
    };

    connect();

    return () => {
      room.disconnect();
    };
  }, [room, username, roomId, grant]);

  useEffect(() => {
    setShowChat("showChat", !isMobile);
  }, [isMobile, setShowChat]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <RoomContext.Provider value={room}>
      <RoomAudioRenderer volume={participantVolume / 100} />
      <div className="h-dvh w-dvw md:pt-4">
        <div className="flex size-full flex-col-reverse md:flex-col md:gap-2">
          <div>
            <Controls />
          </div>
          <div className="flex size-full min-h-0 basis-full">
            <div className="relative flex-1">
              {isMobile ? <ActiveSpeakerPanel /> : <ParticipantsGrid />}
              <div className="absolute bottom-4 left-4 z-10 h-1/4 max-h-48 w-1/4 max-w-64">
                <LocalParticipantTile />
              </div>
            </div>
            <Chat />
          </div>
          {isMobile ? null : <div className={`w-full basis-1/3 ${showKeyboard ? "" : "hidden"}`}>
            <Piano />
          </div>
          }
        </div>
      </div>
    </RoomContext.Provider>
  );
};
