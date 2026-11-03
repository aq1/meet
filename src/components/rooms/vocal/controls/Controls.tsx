import { Separator } from "@/components/ui/separator";
import { CallDuration } from "./CallDuration";
import { CameraControl } from "./CameraControl";
import { ChatToggle } from "./ChatToggle";
import { KeyboardControl } from "./KeyboardControl";
import { LeaveButton } from "./LeaveButton";
import { MicControl } from "./MicControl";
import { ScreenShareToggle } from "./ScreenShareToggle";
import { SettingsMenu } from "./SettingsMenu";
import { StartAudioButton, StartVideoButton } from "./StartAudioVideoButton";
import { Version } from "./Version";

export const Controls = () => {
  return (
    <div className="flex size-full justify-center lg:justify-between px-4 py-2 lg:py-0">
      <div className="flex gap-4">
        <Version />
        <CallDuration />
      </div>
      <div className="flex size-full gap-4 justify-center lg:justify-end">
        <StartVideoButton />
        <StartAudioButton />
        <MicControl />
        <CameraControl />
        <ScreenShareToggle />
        <KeyboardControl />
        <ChatToggle />
        <SettingsMenu />
        <Separator orientation="vertical" />
        <LeaveButton />
      </div>
    </div>
  );
};
