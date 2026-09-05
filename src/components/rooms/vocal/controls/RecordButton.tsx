import { useIsRecording, useRoomContext } from "@livekit/components-react";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { CircleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { startRoomRecording } from "#/lib/livekit";

const startEgress = createServerFn({ method: "POST" })
  .validator((data: { roomName: string }) => data)
  .handler(async ({ data }) => {
    const info = await startRoomRecording(data.roomName);
    return { egressId: info.egressId };
  });

export const RecordButton = () => {
  const room = useRoomContext();
  const isRecording = useIsRecording();
  const start = useServerFn(startEgress);
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (!room.name) {
      return;
    }
    setPending(true);
    try {
      await start({ data: { roomName: room.name } });
    } catch (e) {
      console.error("egress start failed", e);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isRecording || pending}
      loading={pending}
      variant={isRecording ? "destructive" : "outline"}
      size="icon-xl"
      title={isRecording ? "Recording" : "Start recording"}
    >
      <CircleIcon className={isRecording ? "fill-current" : undefined} />
    </Button>
  );
};
