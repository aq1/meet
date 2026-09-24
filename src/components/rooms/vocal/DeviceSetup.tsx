import { useMediaDevices, usePreviewTracks } from "@livekit/components-react";
import { LocalVideoTrack } from "livekit-client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useControls } from "./controls/controls-state";
import { VolumeIcon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Spinner } from "#/components/ui/spinner";
import { Field } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useUser } from "#/lib/user-store";
import { Form } from "#/components/ui/form";

type DeviceSelectorT = {
  kind: MediaDeviceKind;
  value: string | undefined;
  onChange: (deviceId: string) => void;
  icon: React.ReactNode;
  label: string;
};

const DeviceSelector = ({ kind, value, onChange, icon, label }: DeviceSelectorT) => {
  const devices = useMediaDevices({ kind });

  const items = useMemo(() => {
    const mapped = devices
      .sort((a, b) => {
        if (a.deviceId == "default") {
          return -1;
        }
        if (b.deviceId == "default") {
          return 1;
        }
        return 0;
      })
      .filter((d) => d.deviceId && d.deviceId !== "communications")
      .map((d, index) => ({
        label: d.label || `${label} ${index + 1}`,
        value: d.deviceId,
      }));

    return mapped;
  }, [devices, label]);

  useEffect(() => {
    if (items.length) {
      onChange(items[0].value);
    }
  }, [items]);

  return (
    <Select
      items={items}
      value={value ?? ""}
      onValueChange={(next) => {
        onChange(next ?? "");
      }}
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

type DeviceSetupT = {
  onJoin: () => void;
};

export function DeviceSetup({ onJoin }: DeviceSetupT) {
  const [state, setState] = useState<"loading" | "idle" | "joining">("loading");

  const username = useUser((state) => state.username);
  const updateUsername = useUser((state) => state.updateUsername);

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
      audio: micEnabled ? { deviceId: micDeviceId || undefined } : false,
      video: cameraEnabled ? { deviceId: cameraDeviceId || undefined } : false,
    }),
    [micEnabled, cameraEnabled, micDeviceId, cameraDeviceId],
  );

  const tracks = usePreviewTracks(previewOptions, () => {
    setPermissionError(true);
    setCameraEnabled(false);
    setMicEnabled(false);
    setState("idle");
  });

  useEffect(() => {
    setState("idle");
  }, []);

  const videoTrack = tracks?.find((t): t is LocalVideoTrack => t instanceof LocalVideoTrack);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoTrack) return;
    videoTrack.attach(el);
    return () => {
      videoTrack.detach(el);
    };
  }, [videoTrack]);

  const join = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("joining");
    onJoin();
  };

  return (
    <div className="flex flex-col w-full items-center p-4">
      <div className="flex flex-col items-center gap-4 w-full md:w-1/2">
        <div className="w-full relative aspect-video overflow-hidden rounded-xl border">
          {cameraEnabled && videoTrack ? (
            <video ref={videoRef} autoPlay muted playsInline className="size-full -scale-x-100 object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center">
              <VideoOffIcon className="size-8 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/40 to-transparent p-3">
            <div></div>
            <div className="flex gap-4">
              <Button
                variant={micEnabled ? "default" : "destructive"}
                size="icon-xl"
                onClick={() => {
                  setPermissionError(false);
                  setMicEnabled(!micEnabled);
                }}
                title={micEnabled ? "Turn off microphone" : "Turn on microphone"}
                aria-label={micEnabled ? "Turn off microphone" : "Turn on microphone"}
              >
                {micEnabled ? <MicIcon /> : <MicOffIcon />}
              </Button>
              <Button
                variant={cameraEnabled ? "default" : "destructive"}
                size="icon-xl"
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
            <div></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full gap-2">
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
        {permissionError ? (
          <div className="w-full">
            <p className="text-destructive text-sm">
              Camera/mic access blocked — check your browser permissions, then turn them back on.
            </p>
          </div>
        ) : null}
        <div className="w-full flex gap-2 items-center justify-end">
          <Form className="contents" onSubmit={join}>
            <Field>
              <Input
                className="h-full"
                autoFocus
                required
                value={username}
                onChange={(event) => updateUsername(event.target.value)}
                placeholder="Your name"
                type="text"
              />
            </Field>
            <Button type="submit" className="px-10" disabled={state !== "idle"}>
              {state !== "idle" ? <Spinner /> : "Join"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
