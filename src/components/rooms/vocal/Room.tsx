import { RoomAudioRenderer, RoomContext } from "@livekit/components-react";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Room } from "livekit-client";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Chat } from "#/components/chat/Chat";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPortal,
  DialogPrimitive,
  DialogTitle,
} from "#/components/ui/dialog";
import { useIsMobile } from "#/hooks/use-media-query";
import { grantLivekitToken } from "#/lib/livekit";
import { useUser } from "#/lib/user-store";
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
  const showChat = useControls((state) => state.showChat);
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);
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

  // Chat is visible by default on desktop, hidden on mobile.
  useEffect(() => {
    setShowChat("showChat", !isMobile);
  }, [isMobile, setShowChat]);

  // Warn before leaving while connected to the room.
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
      <div className="h-dvh w-dvw md:pt-4 pb-24 md:pb-0">
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
            {isMobile ? null : (
              <div
                className={`flex basis-1/4 justify-end gap-4 min-h-0 ${showChat ? "" : "hidden"
                  }`}
              >
                <div className="size-full flex flex-col px-4 min-h-0">
                  <Chat />
                </div>
              </div>
            )}
          </div>
          <div className={`w-full basis-1/3 ${showKeyboard ? "" : "hidden"}`}>
            <Piano />
          </div>
        </div>
      </div>
      {isMobile ? (
        <Dialog open={showChat} onOpenChange={() => toggle("showChat")}>
          <DialogPortal keepMounted>
            <DialogBackdrop />
            <DialogPrimitive.Popup
              className="fixed inset-0 z-50 flex flex-col gap-2 bg-background p-4 pt-[max(1rem,env(safe-area-inset-top))] outline-none transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
              data-slot="dialog-popup"
            >
              <div className="flex items-center justify-between">
                <DialogTitle>Chat</DialogTitle>
                <DialogClose
                  aria-label="Close"
                  render={<Button size="icon" variant="ghost" title="Close" />}
                >
                  <XIcon />
                </DialogClose>
              </div>
              <div className="flex-1 min-h-0">
                <Chat />
              </div>
            </DialogPrimitive.Popup>
          </DialogPortal>
        </Dialog>
      ) : null}
    </RoomContext.Provider>
  );
};
