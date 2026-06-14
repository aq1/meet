import { useMediaDeviceSelect } from "@livekit/components-react";
import type * as React from "react";
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
} from "#/components/ui/menu";

export const MediaDeviceSelect = ({
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
    .filter(
      (d) =>
        d.deviceId &&
        d.deviceId !== "default" &&
        d.deviceId !== "communications",
    )
    .map((d, index) => ({
      label: d.label || `${label} ${index + 1}`,
      value: d.deviceId,
    }));

  return (
    <MenuGroup>
      <MenuGroupLabel className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-80">
        {icon}
        {label}
      </MenuGroupLabel>
      {items.length ? (
        <MenuRadioGroup
          value={activeDeviceId}
          onValueChange={(value) => {
            if (value) setActiveMediaDevice(value);
          }}
        >
          {items.map(({ label, value }) => (
            <MenuRadioItem closeOnClick key={value} value={value}>
              {label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      ) : (
        <MenuItem disabled>No {label.toLowerCase()} detected</MenuItem>
      )}
    </MenuGroup>
  );
};
