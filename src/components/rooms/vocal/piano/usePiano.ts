import { useDataChannel, useLocalParticipant } from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { useCallback, useEffect } from "react";
import { useKeysStore } from "./keys";
import { useMidiStore } from "./midi";
import { useSamplerStore } from "./sampler";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

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

  const { send: liveKitSendPress } = useDataChannel("piano-press", (msg) => {
    if (!msg.from) {
      return;
    }
    onPress(Number(decoder.decode(msg.payload)), msg.from);
  });

  const { send: liveKitSendRelease } = useDataChannel(
    "piano-release",
    (msg) => {
      if (!msg.from) {
        return;
      }
      onRelease(Number(decoder.decode(msg.payload)), msg.from);
    },
  );

  const onPress = useCallback(
    (midi: number, from: Participant) => {
      addKeyPress(midi, from);
      startNote(midi);
      if (!from.isLocal) {
        return;
      }
      liveKitSendPress(encoder.encode(midi.toString()), { reliable: false });
    },
    [addKeyPress, startNote, liveKitSendPress],
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
      liveKitSendRelease(encoder.encode(midi.toString()), { reliable: false });
    },
    [removeKeyPress, stopNote, liveKitSendRelease],
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

  return onNote;
};
