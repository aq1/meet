import { ClientOnly } from "@tanstack/react-router";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

type DateTimeT = {
  value?: Date | string | number | null;
};

export function DateTime({ value }: DateTimeT) {
  if (!value) {
    return null;
  }
  return <ClientOnly>{dateFormat.format(new Date(value))}</ClientOnly>;
}
