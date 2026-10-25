import type { ReceivedDataMessage } from "@livekit/components-core";
import { useDataChannel } from "@livekit/components-react";
import { useEffect } from "react";
import { AudioSyncSchema, useAudioSync } from "./audio-sync-state";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const onMessage = (msg: ReceivedDataMessage<"audio-sync">) => {
  const result = AudioSyncSchema.safeParse(decoder.decode(msg.payload));
  if (result.success) {
    useAudioSync.getState().receive(result.data);
  }
};

export const AudioSyncBridge = () => {
  const { send } = useDataChannel("audio-sync", onMessage);

  useEffect(() => {
    useAudioSync.setState({
      send: (msg) => send(encoder.encode(JSON.stringify(msg)), { reliable: true }),
    });
    return () => useAudioSync.setState({ send: null });
  }, [send]);

  useEffect(() => () => useAudioSync.setState({ sync: null }), []);

  return null;
};
