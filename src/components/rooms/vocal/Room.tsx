import { useEffect } from "react";
import { Chat } from "@/components/rooms/vocal/chat/Chat";
import { useIsTablet } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Controls } from "./controls";
import { useControls } from "./controls/controls-state";
import { Participants } from "./Participants";
import { Piano } from "./piano/Piano";

export const VocalRoom = () => {
  const isTablet = useIsTablet();
  const showKeyboard = useControls((state) => state.showKeyboard);
  const setControls = useControls((state) => state.set);

  useEffect(() => {
    setControls("showChat", !isTablet);
    setControls("showKeyboard", !isTablet);
  }, [isTablet, setControls]);

  return (
    <div className="h-dvh w-dvw pt-2 lg:pt-4">
      <div className="flex size-full flex-col lg:gap-4">
        <div className="order-last lg:order-0">
          <Controls />
        </div>
        <div className="order-first flex gap-4 px-4 size-full min-h-0 basis-full lg:order-0 overflow-hidden">
          <Participants />
          <Chat />
        </div>
        <div className={cn("w-full min-h-50 h-50 basis-1/3", !showKeyboard && "hidden")}>
          <Piano />
        </div>
      </div>
    </div>
  );
};
