import { Separator } from "#/components/ui/separator";
import { CameraControl } from "./CameraControl";
import { ChatToggle } from "./ChatToggle";
import { KeyboardToggle } from "./KeyboardToggle";
import { LeaveButton } from "./LeaveButton";
import { MicControl } from "./MicControl";
import { ScreenShareToggle } from "./ScreenShareToggle";
import { SettingsMenu } from "./SettingsMenu";

export const Controls = () => {
  return (
    <div className="flex size-full justify-center gap-4 px-4 py-2 md:justify-end md:py-0">
      <MicControl />
      <CameraControl />
      <ScreenShareToggle />
      <KeyboardToggle />
      <ChatToggle />
      <SettingsMenu />
      <Separator orientation="vertical" />
      <LeaveButton />
    </div>
  );
};
