import { useEffect } from "react";
import { Chat } from "@/components/rooms/vocal/chat/Chat";
import { SidePanel } from "@/components/side-panel/SidePanel";
import { useIsTablet } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Controls } from "./controls";
import { useControls } from "./controls/controls-state";
import { Participants } from "./Participants";
import { Piano } from "./piano/Piano";

export const VocalRoom = () => {
  const isTablet = useIsTablet();
  const showChat = useControls((state) => state.showChat);
  const showKeyboard = useControls((state) => state.showKeyboard);
  const setControls = useControls((state) => state.set);

  useEffect(() => {
    setControls("showChat", !isTablet);
    setControls("showKeyboard", !isTablet);
  }, [isTablet, setControls]);

  return (
    <div className="h-dvh w-dvw lg:pt-4">
      <div className="flex size-full flex-col lg:gap-2">
        <div className="order-last lg:order-0">
          <Controls />
        </div>
        <div className="order-first flex size-full min-h-0 basis-full lg:order-0">
          <Participants />
          <SidePanel>
            <div className={cn("size-full", !showChat && "hidden")}>
              <Chat />
            </div>
          </SidePanel>
        </div>
        <div className={cn("w-full min-h-50 h-50 basis-1/3", !showKeyboard && "hidden")}>
          <Piano />
        </div>
      </div>
    </div>
  );
};
