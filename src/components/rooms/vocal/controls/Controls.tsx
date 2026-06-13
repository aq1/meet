import { Separator } from "#/components/ui/separator";
import { useIsMobile } from "#/hooks/use-media-query";
import { CameraControl } from "./CameraControl";
import { ChatToggle } from "./ChatToggle";
import { LeaveButton } from "./LeaveButton";
import { MicControl } from "./MicControl";
import { PianoControl } from "./PianoControl";
import { ScreenShareToggle } from "./ScreenShareToggle";
import { SettingsPopover } from "./SettingsPopover";

export const Controls = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex items-center border-t bg-background/80 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:static md:z-auto md:border-0 md:bg-transparent md:px-6 md:py-0 md:pb-0 md:backdrop-blur-none">
      <div className="w-full h-full flex justify-center items-center gap-3 md:justify-end md:gap-6">
        <MicControl />
        <CameraControl />
        {isMobile ? null : <ScreenShareToggle />}
        <PianoControl />
        <ChatToggle />
        <SettingsPopover />
        <Separator orientation="vertical" />
        <LeaveButton />
      </div>
    </div>
  );
};
