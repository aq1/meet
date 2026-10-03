import type { ReceivedDataMessage } from "@livekit/components-core";
import { useDataChannel } from "@livekit/components-react";
import { useEffect } from "react";
import { type AudioSync, useAudioSync } from "./audio-sync-state";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const onMessage = (msg: ReceivedDataMessage<"audio-sync">) => {
  useAudioSync.getState().receive(JSON.parse(decoder.decode(msg.payload)) as AudioSync);
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
