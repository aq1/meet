import { ClientOnly } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

type DateInput = Date | string | number;

type DurationT = {
  from: DateInput;
  to?: DateInput;
};

function formatDuration(from: DateInput, to: DateInput) {
  const minutes = Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000));
  if (minutes < 60) return m.dashboard_duration_minutes({ minutes });
  return m.dashboard_duration_hours({ hours: Math.floor(minutes / 60), minutes: minutes % 60 });
}

export function Duration({ from, to }: DurationT) {
  return <ClientOnly>{formatDuration(from, to ?? Date.now())}</ClientOnly>;
}
