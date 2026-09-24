import { RoomContext } from "@livekit/components-react";
import { Room } from "livekit-client";
import { useEffect } from "react";
import { Chat } from "#/components/chat/Chat";
import { useIsTablet } from "#/hooks/use-media-query";
import { cn } from "#/lib/utils";
import { Controls } from "./controls";
import { useControls } from "./controls/controls-state";
import { Participants } from "./Participants";
import { Piano } from "./piano/Piano";

type VocalRoom = {
  room: Room;
};

export const VocalRoom = ({ room }: VocalRoom) => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const isTablet = useIsTablet();
  const setControls = useControls((state) => state.set);

  useEffect(() => {
    setControls("showChat", !isTablet);
    setControls("showKeyboard", !isTablet);
  }, [isTablet, setControls]);

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
      <div className="h-dvh w-dvw lg:pt-4">
        <div className="flex size-full flex-col lg:gap-2">
          <div className="order-last lg:order-none">
            <Controls />
          </div>
          <div className="order-first flex size-full min-h-0 basis-full lg:order-none">
            <Participants />
            <Chat />
          </div>
          <div className={cn("w-full basis-1/3", !showKeyboard && "hidden")}>
            <Piano />
          </div>
          )
        </div>
      </div>
    </RoomContext.Provider>
  );
};
