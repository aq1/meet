import type { ReceivedDataMessage } from "@livekit/components-core";
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

  const onPress = useCallback(
    (midi: number, from: Participant) => {
      addKeyPress(midi, from);
      startNote(midi);
    },
    [addKeyPress, startNote],
  );

  const onRelease = useCallback(
    (midi: number, from: Participant) => {
      const keys = removeKeyPress(midi, from);
      if (!keys.length) {
        stopNote(midi);
      }
    },
    [removeKeyPress, stopNote],
  );

  const lkPressCallback = useCallback(
    (msg: ReceivedDataMessage<"piano-press">) => {
      if (!msg.from) {
        return;
      }
      onPress(Number(decoder.decode(msg.payload)), msg.from);
    },
    [onPress],
  );

  const lkReleaseCallback = useCallback(
    (msg: ReceivedDataMessage<"piano-release">) => {
      if (!msg.from) {
        return;
      }
      onRelease(Number(decoder.decode(msg.payload)), msg.from);
    },
    [onRelease],
  );

  const { send: liveKitSendPress } = useDataChannel(
    "piano-press",
    lkPressCallback,
  );

  const { send: liveKitSendRelease } = useDataChannel(
    "piano-release",
    lkReleaseCallback,
  );

  const onNote = useCallback(
    (kind: "press" | "release", midi: number) => {
      if (kind === "press") {
        onPress(midi, localParticipant);
        liveKitSendPress(encoder.encode(midi.toString()), { reliable: false });
      }
      if (kind === "release") {
        onRelease(midi, localParticipant);
        liveKitSendRelease(encoder.encode(midi.toString()), {
          reliable: false,
        });
      }
    },
    [
      localParticipant,
      onPress,
      onRelease,
      liveKitSendPress,
      liveKitSendRelease,
    ],
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
