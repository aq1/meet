import { useMediaDeviceSelect } from "@livekit/components-react";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

export const MediaDeviceSelect = ({
  kind,
  label,
}: {
  kind: "audioinput" | "videoinput" | "audiooutput";
  label: string;
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
    <Select
      aria-label={`Select ${label.toLowerCase()}`}
      items={items}
      onValueChange={(value) => {
        if (value) setActiveMediaDevice(value);
      }}
      value={activeDeviceId}
    >
      <SelectTrigger disabled={!items.length}>
        <SelectValue
          placeholder={
            items.length
              ? `Select ${label.toLowerCase()}`
              : `No ${label.toLowerCase()} detected`
          }
        />
      </SelectTrigger>
      <SelectPopup>
        {items.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
};
