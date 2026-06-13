import { useMediaDeviceSelect } from "@livekit/components-react";
import {
  MicIcon,
  PianoIcon,
  Settings,
  UsersIcon,
  VideoIcon,
  VolumeIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldLabel } from "#/components/ui/field";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from "#/components/ui/menu";
import { Slider } from "#/components/ui/slider";
import { useParticipantVolume } from "../controls-state";
import { useSynth } from "../Synth";

const MediaDeviceMenu = ({
  kind,
  label,
  icon,
}: {
  kind: "audioinput" | "videoinput" | "audiooutput";
  label: string;
  icon: React.ReactNode;
}) => {
  const { devices, activeDeviceId, setActiveMediaDevice } =
    useMediaDeviceSelect({ kind, requestPermissions: true });

  const items = devices
    .filter((d) => d.deviceId)
    .map((d, index) => ({
      label: d.label || `${label} ${index + 1}`,
      value: d.deviceId,
    }));

  return (
    <MenuSub>
      <MenuSubTrigger>
        {icon}
        {label}
      </MenuSubTrigger>
      <MenuSubPopup side="inline-start" className="w-64">
        {items.length ? (
          <MenuRadioGroup
            value={activeDeviceId}
            onValueChange={(value) => {
              if (value) setActiveMediaDevice(value);
            }}
          >
            {items.map(({ label, value }) => (
              <MenuRadioItem key={value} value={value}>
                {label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        ) : (
          <MenuItem disabled>No {label.toLowerCase()} detected</MenuItem>
        )}
      </MenuSubPopup>
    </MenuSub>
  );
};

const MidiDeviceMenu = () => {
  const { devices, selectedDevice, setSelectedDevice } = useSynth();

  return (
    <MenuSub>
      <MenuSubTrigger>
        <PianoIcon />
        MIDI
      </MenuSubTrigger>
      <MenuSubPopup side="inline-start" className="w-64">
        {devices.length ? (
          <MenuRadioGroup
            value={selectedDevice?.id ?? null}
            onValueChange={(id) =>
              setSelectedDevice(devices.find((d) => d.id === id) ?? null)
            }
          >
            {devices.map((device) => (
              <MenuRadioItem key={device.id} value={device.id}>
                {device.name}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        ) : (
          <MenuItem disabled>No MIDI detected</MenuItem>
        )}
      </MenuSubPopup>
    </MenuSub>
  );
};

const SLIDER_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

const VolumeControls = () => {
  const participantsVolume = useParticipantVolume((state) => state.volume);
  const setParticipantsVolume = useParticipantVolume(
    (state) => state.setVolume,
  );
  const { volume: pianoVolume, setVolume: setPianoVolume } = useSynth();

  // Keep the menu's arrow-key navigation from stealing the slider's own
  // keyboard handling while the thumb is focused.
  const stopSliderKeys = (event: React.KeyboardEvent) => {
    if (SLIDER_KEYS.has(event.key)) event.stopPropagation();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: scoping key events to the sliders.
    <div className="flex flex-col gap-5 px-2 py-2" onKeyDown={stopSliderKeys}>
      <Field>
        <Slider
          value={participantsVolume}
          onValueChange={(next) =>
            setParticipantsVolume(Array.isArray(next) ? next[0] : next)
          }
        >
          <FieldLabel className="mb-3.5 gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
            <UsersIcon />
            Participants
          </FieldLabel>
        </Slider>
      </Field>
      <Field>
        <Slider
          value={pianoVolume}
          onValueChange={(next) =>
            setPianoVolume(Array.isArray(next) ? next[0] : next)
          }
        >
          <FieldLabel className="mb-3.5 gap-2 font-normal text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-80">
            <PianoIcon />
            Piano
          </FieldLabel>
        </Slider>
      </Field>
    </div>
  );
};

export const SettingsMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Menu open={open} onOpenChange={setOpen}>
      <MenuTrigger
        render={
          <Button
            variant={open ? "default" : "outline"}
            size="icon-xl"
            title="Settings"
          />
        }
      >
        <Settings />
      </MenuTrigger>
      <MenuPopup side="top" sideOffset={14} align="end" className="w-64">
        <MenuGroup>
          <MenuGroupLabel>Devices</MenuGroupLabel>
          <MediaDeviceMenu
            kind="audioinput"
            label="Microphone"
            icon={<MicIcon />}
          />
          <MediaDeviceMenu
            kind="audiooutput"
            label="Speaker"
            icon={<VolumeIcon />}
          />
          <MediaDeviceMenu
            kind="videoinput"
            label="Camera"
            icon={<VideoIcon />}
          />
          <MidiDeviceMenu />
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Volume</MenuGroupLabel>
          <VolumeControls />
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
};
