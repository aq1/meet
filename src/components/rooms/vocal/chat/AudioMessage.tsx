import { useRoomContext } from "@livekit/components-react";
import { useServerFn } from "@tanstack/react-start";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { presignChatDownloadServerFn } from "@/lib/chat/functions/presign-chat-download.function";
import { useRoomToken } from "../room-token";

type AudioMessageT = { url: string };

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const AudioMessage = ({ url }: AudioMessageT) => {
  const room = useRoomContext();
  const token = useRoomToken();
  const waveRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const presignDownload = useServerFn(presignChatDownloadServerFn);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const container = waveRef.current;
    if (!container) {
      return;
    }
    let cancelled = false;

    const create = (src: string) => {
      if (cancelled) {
        return;
      }
      const ws = WaveSurfer.create({
        container,
        url: src,
        height: 40,
        waveColor: "rgba(148, 163, 184, 0.55)",
        progressColor: getComputedStyle(container).color,
        cursorWidth: 0,
        barWidth: 3,
        barGap: 2,
        barRadius: 3,
        normalize: true,
        dragToSeek: true,
      });
      ws.on("ready", (d) => {
        setDuration(d);
        setReady(true);
      });
      ws.on("timeupdate", setCurrentTime);
      ws.on("play", () => setPlaying(true));
      ws.on("pause", () => setPlaying(false));
      ws.on("finish", () => setPlaying(false));
      ws.on("interaction", () => ws.play());
      wsRef.current = ws;
    };

    if (import.meta.env.DEV) {
      create(url);
    } else {
      presignDownload({ data: { roomId: room.name, token, url } })
        .then(create)
        .catch(() => {});
    }

    return () => {
      cancelled = true;
      wsRef.current?.destroy();
      wsRef.current = null;
    };
  }, [presignDownload, room.name, token, url]);

  return (
    <div className="flex w-full items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2">
      <Button
        type="button"
        size="icon"
        className="size-9 shrink-0 rounded-full"
        disabled={!ready}
        onClick={() => wsRef.current?.playPause()}
      >
        {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
      </Button>
      <div className="relative min-w-0 flex-1">
        <div ref={waveRef} className="w-full cursor-pointer text-primary" />
        {!ready && <div className="absolute inset-0 animate-pulse rounded-md bg-muted" />}
      </div>
      <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {formatTime(playing || currentTime > 0 ? currentTime : duration)}
      </span>
    </div>
  );
};
