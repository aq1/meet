import type { ReceivedDataMessage } from "@livekit/components-core";
import { useDataChannel, useRoomContext } from "@livekit/components-react";
import { useServerFn } from "@tanstack/react-start";
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { presignChatDownloadServerFn } from "@/apps/rooms/functions/presign-chat-download";
import { Button } from "@/components/ui/button";
import { useRoomToken } from "../room-token";

type AudioMessageT = { url: string };

type AudioSyncMsg = { url: string; action: "play" | "pause"; time: number };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const applySync = (ws: WaveSurfer, msg: AudioSyncMsg) => {
  ws.setTime(msg.time);
  if (msg.action === "play") {
    ws.play().catch(() => {});
  }
  if (msg.action === "pause") {
    ws.pause();
  }
};

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
  const pendingSyncRef = useRef<AudioSyncMsg | null>(null);

  const onSync = useCallback(
    (msg: ReceivedDataMessage<"audio-sync">) => {
      const data = JSON.parse(decoder.decode(msg.payload)) as AudioSyncMsg;
      if (data.url !== url) {
        return;
      }
      const ws = wsRef.current;
      if (!ws || !ws.getDuration()) {
        pendingSyncRef.current = data;
        return;
      }
      applySync(ws, data);
    },
    [url],
  );

  const { send } = useDataChannel("audio-sync", onSync);

  const broadcast = useCallback(
    (action: AudioSyncMsg["action"], time: number) => {
      send(encoder.encode(JSON.stringify({ url, action, time } satisfies AudioSyncMsg)), { reliable: true });
    },
    [send, url],
  );

  const broadcastRef = useRef(broadcast);
  useEffect(() => {
    broadcastRef.current = broadcast;
  }, [broadcast]);

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
        if (pendingSyncRef.current) {
          applySync(ws, pendingSyncRef.current);
          pendingSyncRef.current = null;
        }
      });
      ws.on("timeupdate", setCurrentTime);
      ws.on("play", () => setPlaying(true));
      ws.on("pause", () => setPlaying(false));
      ws.on("finish", () => setPlaying(false));
      ws.on("interaction", (time) => {
        ws.play();
        broadcastRef.current("play", time);
      });
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
        onClick={() => {
          const ws = wsRef.current;
          if (!ws) {
            return;
          }
          const willPlay = !ws.isPlaying();
          ws.playPause();
          broadcast(willPlay ? "play" : "pause", ws.getCurrentTime());
        }}
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
