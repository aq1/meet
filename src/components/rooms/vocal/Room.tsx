import { RoomContext } from "@livekit/components-react";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Room } from "livekit-client";
import { useEffect, useState } from "react";
import { Chat } from "#/components/chat/Chat";
import { useIsMobile } from "#/hooks/use-media-query";
import { grantLivekitToken } from "#/lib/livekit";
import { useUser } from "#/lib/user-store";
import { cn } from "#/lib/utils";
import { Controls } from "./controls";
import { useControls } from "./controls-state";
import { Participants } from "./Participants";
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
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <RoomContext.Provider value={room}>
      <div className="h-dvh w-dvw md:pt-4">
        <div className="flex size-full flex-col md:gap-2">
          <div className="order-last md:order-none">
            <Controls />
          </div>
          <div className="order-first flex size-full min-h-0 basis-full md:order-none">
            <Participants />
            <Chat />
          </div>
          <div className={cn("w-full basis-1/3", !showKeyboard && "hidden")}>
            <Piano />
          </div>
        </div>
      </div>
    </RoomContext.Provider>
  );
};
