import { useMediaDeviceSelect } from "@livekit/components-react";
import type * as React from "react";
import { MenuGroup, MenuGroupLabel, MenuItem, MenuRadioGroup, MenuRadioItem } from "@/components/ui/menu";
import { m } from "@/paraglide/messages";

export const MediaDeviceSelect = ({
  kind,
  label,
  emptyLabel,
  icon,
}: {
  kind: "audioinput" | "videoinput" | "audiooutput";
  label: string;
  emptyLabel: string;
  icon: React.ReactNode;
}) => {
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({ kind, requestPermissions: true });

  const items = devices
    .filter((d) => d.deviceId && d.deviceId !== "communications")
    .map((d, index) => ({
      label: d.label || m.device_fallback_label({ label, index: index + 1 }),
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
        <MenuItem disabled>{emptyLabel}</MenuItem>
      )}
    </MenuGroup>
  );
};
