import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useCallback, useState } from "react";
import { Button } from "#/components/ui/button";

type Message = {
  content: string;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const generateMessages = (): Message[] =>
  "The quick brown fox jumps over the lazy dog and keeps on running."
    .split(" ")
    .map((word) => ({ content: `${word} ` }));

const streamMessages = createServerFn().handler(async function* () {
  for (const msg of generateMessages()) {
    await sleep(500);
    yield msg;
  }
});

export const Route = createFileRoute("/_private/test/stream")({
  component: StreamTestPage,
});

function StreamTestPage() {
  const [chunks, setChunks] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(false);

  const start = useCallback(async () => {
    setChunks([]);
    setStreaming(true);
    try {
      for await (const msg of await streamMessages()) {
        setChunks((prev) => [...prev, msg.content]);
      }
    } finally {
      setStreaming(false);
    }
  }, []);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 p-8">
      <Button type="button" onClick={start} disabled={streaming}>
        {streaming ? "Streaming…" : "Start stream"}
      </Button>
      <p className="min-h-6 max-w-prose whitespace-pre-wrap font-mono text-sm">
        {chunks.join("")}
        {streaming && <span className="animate-pulse">▍</span>}
      </p>
      <span className="text-muted-foreground text-xs">{chunks.length} chunks received</span>
    </div>
  );
}
