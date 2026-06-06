import { Chat } from "#/components/chat/Chat";
import { ParticipantVideoTile } from "#/components/participant-video-tile/ParticipantVideoTile";
import { Controls } from "./Controls";
import { useControls } from "./controls-state";
import { Piano } from "./Piano";

export const VocalRoom = () => {
  const controls = useControls();

  return (
    <div className="h-dvh w-dvw pt-4">
      <div className="size-full flex flex-col gap-4">
        <div>
          <Controls />
        </div>
        <div className="size-full flex basis-full min-h-0">
          <div className="flex-1">
            <ParticipantVideoTile />
          </div>
          <div className="flex basis-1/4 justify-end gap-4 min-h-0">
            <div className="size-full flex flex-col px-4 min-h-0">
              <Chat />
            </div>
          </div>
        </div>
        {controls.showKeyboard ? (
          <div className="w-full basis-1/3">
            <Piano />
          </div>
        ) : null}
      </div>
    </div>
  );
};
