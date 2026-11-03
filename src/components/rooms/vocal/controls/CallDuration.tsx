import { useEffect, useState } from "react";
import { useRoomStore } from "../room-state";

const format = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export const CallDuration = () => {
  const startedAt = useRoomStore((state) => state.startedAt);
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (!startedAt) {
      return;
    }
    const interval = setInterval(() => {
      setDuration(format(Date.now() - Number(startedAt)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="hidden h-full items-center justify-center text-sm text-muted-foreground lg:flex">
      <span>{duration}</span>
    </div>
  );
};
