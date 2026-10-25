import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { useControls } from "../controls/controls-state";
import { useAudioSync } from "./audio-sync-state";

type AudioMessageT = { payload: { key: string; url: string; fileName: string } };

export const AudioMessage = ({ payload }: AudioMessageT) => {
  const { key, url } = payload;
  const sync = useAudioSync((state) => (state.sync?.key === key ? state.sync : null));
  const fileVolume = useControls((state) => state.fileVolume);

  return (
    <div className="flex flex-col gap-1 w-full items-end pb-2">
      <AudioPlayer
        url={url}
        volume={fileVolume}
        sync={sync}
        onControl={(state) => useAudioSync.getState().control({ key, ...state })}
      />
      <p className="text-xs text-muted-foreground">
        <span>{payload.fileName}</span>
      </p>
    </div>
  );
};
