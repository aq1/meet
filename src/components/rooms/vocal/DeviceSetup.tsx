import { useMediaDevices, usePreviewTracks } from "@livekit/components-react";
import {
  createAudioAnalyser,
  LocalAudioTrack,
  LocalVideoTrack,
} from "livekit-client";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  VolumeIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";
import { useControls } from "./controls/controls-state";

const DeviceSelector = ({
  kind,
  value,
  onChange,
  icon,
  label,
}: {
  kind: MediaDeviceKind;
  value: string | undefined;
  onChange: (deviceId: string) => void;
  icon: React.ReactNode;
  label: string;
}) => {
  const devices = useMediaDevices({ kind });

  const items = useMemo(
    () =>
      devices
        .filter(
          (d) =>
            d.deviceId &&
            d.deviceId !== "default" &&
            d.deviceId !== "communications",
        )
        .map((d, index) => ({
          label: d.label || `${label} ${index + 1}`,
          value: d.deviceId,
        })),
    [devices, label],
  );

  useEffect(() => {
    if (!value && items.length) {
      onChange(items[0].value);
    }
  }, [value, items, onChange]);

  return (
    <Select
      items={items}
      value={value ?? ""}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
      disabled={!items.length}
    >
      <SelectTrigger size="sm" aria-label={label}>
        <span className="flex min-w-0 items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-80">
          {icon}
          <SelectValue placeholder={`No ${label.toLowerCase()} detected`} />
        </span>
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
};

const useAudioLevel = (track: LocalAudioTrack | undefined) => {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!track) {
      setLevel(0);
      return;
    }

    const { calculateVolume, cleanup } = createAudioAnalyser(track, {
      fftSize: 32,
      smoothingTimeConstant: 0.8,
    });

    let frame = 0;
    const update = () => {
      setLevel(calculateVolume());
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [track]);

  return level;
};

export const DeviceSetup = () => {
  const cameraEnabled = useControls((s) => s.cameraEnabled);
  const micEnabled = useControls((s) => s.micEnabled);
  const cameraDeviceId = useControls((s) => s.cameraDeviceId);
  const micDeviceId = useControls((s) => s.micDeviceId);
  const speakerDeviceId = useControls((s) => s.speakerDeviceId);
  const setCameraEnabled = useControls((s) => s.setCameraEnabled);
  const setMicEnabled = useControls((s) => s.setMicEnabled);
  const setCameraDeviceId = useControls((s) => s.setCameraDeviceId);
  const setMicDeviceId = useControls((s) => s.setMicDeviceId);
  const setSpeakerDeviceId = useControls((s) => s.setSpeakerDeviceId);

  const [permissionError, setPermissionError] = useState(false);

  const previewOptions = useMemo(
    () => ({
      audio: micEnabled ? { deviceId: micDeviceId } : false,
      video: cameraEnabled ? { deviceId: cameraDeviceId } : false,
    }),
    [micEnabled, cameraEnabled, micDeviceId, cameraDeviceId],
  );

  const tracks = usePreviewTracks(previewOptions, () => {
    setPermissionError(true);
    setCameraEnabled(false);
    setMicEnabled(false);
  });

  const videoTrack = tracks?.find(
    (t): t is LocalVideoTrack => t instanceof LocalVideoTrack,
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoTrack) return;
    videoTrack.attach(el);
    return () => {
      videoTrack.detach(el);
    };
  }, [videoTrack]);

  return (
    <div className="grid gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        {cameraEnabled && videoTrack ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="size-full -scale-x-100 object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <VideoOffIcon className="size-8 text-muted-foreground" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-linear-to-t from-black/40 to-transparent p-3">
          <Button
            variant={micEnabled ? "outline" : "destructive-outline"}
            size="icon-lg"
            onClick={() => {
              setPermissionError(false);
              setMicEnabled(!micEnabled);
            }}
            title={micEnabled ? "Turn off microphone" : "Turn on microphone"}
            aria-label={
              micEnabled ? "Turn off microphone" : "Turn on microphone"
            }
          >
            {micEnabled ? <MicIcon /> : <MicOffIcon />}
          </Button>
          <Button
            variant={cameraEnabled ? "outline" : "destructive-outline"}
            size="icon-lg"
            onClick={() => {
              setPermissionError(false);
              setCameraEnabled(!cameraEnabled);
            }}
            title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
            aria-label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {cameraEnabled ? <VideoIcon /> : <VideoOffIcon />}
          </Button>
        </div>
      </div>

      {permissionError ? (
        <p className="text-sm text-destructive">
          Camera/mic access blocked — check your browser permissions, then turn
          them back on.
        </p>
      ) : null}

      <div className="grid gap-2">
        <DeviceSelector
          kind="audioinput"
          value={micDeviceId}
          onChange={setMicDeviceId}
          icon={<MicIcon />}
          label="Microphone"
        />
        <DeviceSelector
          kind="videoinput"
          value={cameraDeviceId}
          onChange={setCameraDeviceId}
          icon={<VideoIcon />}
          label="Camera"
        />
        <DeviceSelector
          kind="audiooutput"
          value={speakerDeviceId}
          onChange={setSpeakerDeviceId}
          icon={<VolumeIcon />}
          label="Speaker"
        />
      </div>
    </div>
  );
};
