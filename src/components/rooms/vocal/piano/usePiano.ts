import type { ReceivedDataMessage } from "@livekit/components-core";
import { setupDataMessageHandler } from "@livekit/components-core";
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useKeysStore } from "./keys";
import { useMidiStore } from "./midi";
import { useSamplerStore } from "./sampler";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function useMyDataChannel<T extends string>(
  topic: T,
  callback: (msg: ReceivedDataMessage<T>) => void,
) {
  const room = useRoomContext();
  const cbRef = useRef(callback);
  cbRef.current = callback;

  const { send, messageObservable } = useMemo(
    () => setupDataMessageHandler(room, topic),
    [room, topic],
  );

  useEffect(() => {
    const sub = messageObservable.subscribe((msg) => cbRef.current(msg));
    return () => sub.unsubscribe();
  }, [messageObservable]);

  return send;
}

export const usePiano = () => {
  const { localParticipant } = useLocalParticipant();
  const enableMidi = useMidiStore((s) => s.enable);
  const disableMidi = useMidiStore((s) => s.disable);

  const enableSampler = useSamplerStore((s) => s.enable);
  const disableSampler = useSamplerStore((s) => s.disable);
  const startNote = useSamplerStore((s) => s.startNote);
  const stopNote = useSamplerStore((s) => s.stopNote);

  const addKeyPress = useKeysStore((s) => s.addKeyPress);
  const removeKeyPress = useKeysStore((s) => s.removeKeyPress);

  const sendLiveKitPress = useMyDataChannel("piano-press", (msg) => {
    if (!msg.from) {
      return;
    }
    onPress(Number(decoder.decode(msg.payload)), msg.from);
  });

  const onPress = useCallback(
    (midi: number, from: Participant) => {
      addKeyPress(midi, from);
      startNote(midi);
      if (!from.isLocal) {
        return;
      }
      sendLiveKitPress(encoder.encode(midi.toString()), { reliable: false });
    },
    [addKeyPress, startNote, sendLiveKitPress],
  );

  const onRelease = useCallback(
    (midi: number, from: Participant) => {
      const keys = removeKeyPress(midi, from);
      if (!keys.length) {
        stopNote(midi);
      }
      if (!from.isLocal) {
        return;
      }
    },
    [removeKeyPress, stopNote],
  );

  const onNote = useCallback(
    (kind: "press" | "release", midi: number) => {
      if (kind === "press") {
        onPress(midi, localParticipant);
      }
      if (kind === "release") {
        onRelease(midi, localParticipant);
      }
    },
    [localParticipant, onPress, onRelease],
  );

  useEffect(() => {
    enableMidi(onNote);
    enableSampler();
    return () => {
      disableMidi();
      disableSampler();
    };
  }, [enableMidi, enableSampler, disableMidi, disableSampler, onNote]);

  console.log("yo");
  return onNote;
};
