import { useMediaDevices, usePreviewTracks } from "@livekit/components-react";
import { useRouteContext } from "@tanstack/react-router";
import { LocalVideoTrack } from "livekit-client";
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, VolumeIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { m } from "@/paraglide/messages";
import { useControls } from "./controls/controls-state";

type DeviceSelectorT = {
  kind: MediaDeviceKind;
  value: string | undefined;
  onChange: (deviceId: string) => void;
  icon: React.ReactNode;
  label: string;
  emptyLabel: string;
};

const DeviceSelector = ({ kind, value, onChange, icon, label, emptyLabel }: DeviceSelectorT) => {
  const devices = useMediaDevices({ kind });

  const items = useMemo(() => {
    const mapped = devices
      .sort((a, b) => {
        if (a.deviceId === "default") {
          return -1;
        }
        if (b.deviceId === "default") {
          return 1;
        }
        return 0;
      })
      .filter((d) => d.deviceId && d.deviceId !== "communications")
      .map((d, index) => ({
        label: d.label || m.device_fallback_label({ label, index: index + 1 }),
        value: d.deviceId,
      }));

    return mapped;
  }, [devices, label]);

  useEffect(() => {
    if (items.length) {
      onChange(items[0].value);
    }
  }, [items, onChange]);

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
          <SelectValue placeholder={emptyLabel} />
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

type RoomLobbyT = {
  onJoin: (username: string) => Promise<void>;
};

export function RoomLobby({ onJoin }: RoomLobbyT) {
  const [state, setState] = useState<"loading" | "idle" | "joining">("loading");
  const { user } = useRouteContext({ from: "__root__" });
  const [username, setUsername] = useState(user?.name ?? "");

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
  const [joinError, setJoinError] = useState(false);

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

  const join = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("joining");
    setJoinError(false);
    try {
      await onJoin(username);
    } catch {
      setJoinError(true);
    }
    setState("idle");
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
                title={micEnabled ? m.lobby_turn_off_microphone() : m.lobby_turn_on_microphone()}
                aria-label={micEnabled ? m.lobby_turn_off_microphone() : m.lobby_turn_on_microphone()}
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
                title={cameraEnabled ? m.controls_turn_off_camera() : m.controls_turn_on_camera()}
                aria-label={cameraEnabled ? m.controls_turn_off_camera() : m.controls_turn_on_camera()}
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
            label={m.device_microphone()}
            emptyLabel={m.device_no_microphone()}
          />
          <DeviceSelector
            kind="videoinput"
            value={cameraDeviceId}
            onChange={setCameraDeviceId}
            icon={<VideoIcon />}
            label={m.device_camera()}
            emptyLabel={m.device_no_camera()}
          />
          <DeviceSelector
            kind="audiooutput"
            value={speakerDeviceId}
            onChange={setSpeakerDeviceId}
            icon={<VolumeIcon />}
            label={m.device_speaker()}
            emptyLabel={m.device_no_speaker()}
          />
        </div>
        {permissionError ? (
          <div className="w-full">
            <p className="text-destructive text-sm">{m.lobby_permission_error()}</p>
          </div>
        ) : null}
        {joinError ? (
          <div className="w-full">
            <p className="text-destructive text-sm">{m.lobby_join_error()}</p>
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
                onChange={(e) => setUsername(e.target.value)}
                placeholder={m.lobby_name_placeholder()}
                type="text"
              />
            </Field>
            <Button type="submit" className="px-10" loading={state === "joining"} disabled={state !== "idle"}>
              {m.lobby_join()}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
