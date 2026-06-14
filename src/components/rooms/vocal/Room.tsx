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
        <div className="flex size-full flex-col md:gap-4">
          {isMobile ? null : (
            <div>
              <Controls />
            </div>
          )}
          <div className="flex size-full min-h-0 basis-full">
            <div className="relative flex-1">
              {isMobile ? <ActiveSpeakerPanel /> : <ParticipantsGrid />}
              <div className="absolute bottom-4 left-4 z-10 h-1/4 max-h-48 w-1/4 max-w-64">
                <LocalParticipantTile />
              </div>
            </div>
            {isMobile ? null : (
              <div
                className={`flex min-h-0 basis-1/4 justify-end gap-4 ${showChat ? "" : "hidden"
                  }`}
              >
                <div className="flex size-full min-h-0 flex-col px-4">
                  <Chat />
                </div>
              </div>
            )}
          </div>
          <div className={`w-full basis-1/3 ${showKeyboard ? "" : "hidden"}`}>
            <Piano />
          </div>
          {isMobile ? (
            <div>
              <Controls />
            </div>
          ) : null}
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
              <div className="min-h-0 flex-1">
                <Chat />
              </div>
            </DialogPrimitive.Popup>
          </DialogPortal>
        </Dialog>
      ) : null}
    </RoomContext.Provider>
  );
};
