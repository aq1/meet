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
import { useControls } from "./controls/controls-state";
import { Participants } from "./Participants";
import { Piano } from "./piano/Piano";
import { PreConnectDialog } from "./PreConnectDialog";

const grantToken = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; roomId: string }) => data)
  .handler(
    async ({ data }) => await grantLivekitToken(data.username, data.roomId),
  );

export const VocalRoom = ({ roomId }: { roomId: string }) => {
  const [isReady, setIsReady] = useState(false);

  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      }),
  );
  const showKeyboard = useControls((state) => state.showKeyboard);
  const isMobile = useIsMobile();
  const setControls = useControls((state) => state.set);
  const grant = useServerFn(grantToken);
  const username = useUser((state) => state.username);

  const connect = async () => {
    if (!room || !username) {
      return;
    }
    setIsReady(true);
    const { wss, token } = await grant({
      data: { username, roomId },
    });
    await room.connect(wss, token);
    const {
      cameraEnabled,
      micEnabled,
      cameraDeviceId,
      micDeviceId,
      speakerDeviceId,
    } = useControls.getState();
    try {
      if (micEnabled) {
        await room.localParticipant.setMicrophoneEnabled(true, {
          deviceId: micDeviceId,
        });
      }
      if (cameraEnabled) {
        await room.localParticipant.setCameraEnabled(true, {
          deviceId: cameraDeviceId,
        });
      }
      if (speakerDeviceId) {
        await room.switchActiveDevice("audiooutput", speakerDeviceId);
      }
    } catch { }
  };

  useEffect(() => {
    setControls("showChat", !isMobile);
    setControls("showKeyboard", !isMobile);
  }, [isMobile, setControls]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      room.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [room]);

  return (
    <RoomContext.Provider value={room}>
      <PreConnectDialog open={!isReady} onSubmit={connect} />
      <div className="h-dvh w-dvw lg:pt-4">
        <div className="flex size-full flex-col lg:gap-2">
          <div className="order-last lg:order-none">
            <Controls />
          </div>
          <div className="order-first flex size-full min-h-0 basis-full lg:order-none">
            <Participants />
            <Chat />
          </div>
          {isReady ? (
            <div className={cn("w-full basis-1/3", !showKeyboard && "hidden")}>
              <Piano />
            </div>
          ) : null}
        </div>
      </div>
    </RoomContext.Provider>
  );
};
