import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { useControls } from "../controls/controls-state";
import { useAudioSync } from "./audio-sync-state";

type AudioMessageT = { id: number; file: { url: string; filename: string } };

export const AudioMessage = ({ id, file }: AudioMessageT) => {
  const sync = useAudioSync((state) => (state.sync?.id === id ? state.sync : null));
  const fileVolume = useControls((state) => state.fileVolume);

  return (
    <div className="flex flex-col gap-1 w-full items-end pb-2">
      <AudioPlayer
        url={file.url}
        volume={fileVolume}
        sync={sync}
        onControl={(state) => useAudioSync.getState().control({ id, ...state })}
      />
      <p className="text-xs text-muted-foreground">
        <span>{file.filename}</span>
      </p>
    </div>
  );
};
