import { useEffect } from "react";

export const eventBus = new EventTarget();

export function useEventBus<T = any>(
  eventName: string,
  handler: (data: T) => void
) {
  useEffect(() => {
    const listener = (e: Event) => handler((e as CustomEvent<T>).detail);
    eventBus.addEventListener(eventName, listener);
    return () => {
      eventBus.removeEventListener(eventName, listener);
    };
  }, [eventName, handler]);
}
