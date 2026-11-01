import { ClientOnly } from "@tanstack/react-router";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

type DateTimeT = {
  value: Date | string | number;
};

export function DateTime({ value }: DateTimeT) {
  return <ClientOnly>{dateFormat.format(new Date(value))}</ClientOnly>;
}
