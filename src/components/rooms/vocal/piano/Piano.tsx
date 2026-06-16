import type { ReceivedDataMessage } from "@livekit/components-core";
import { useDataChannel, useLocalParticipant } from "@livekit/components-react";
import { useCallback, useEffect } from "react";
import { Keyboard } from "./Keyboard";
import { useKeysStore } from "./keys";
import { useMidiStore } from "./midi";
import { useSamplerStore } from "./sampler";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const Piano = () => {
  const { localParticipant } = useLocalParticipant();
  const enableMidi = useMidiStore((s) => s.enable);
  const disableMidi = useMidiStore((s) => s.disable);

  const enableSampler = useSamplerStore((s) => s.enable);
  const disableSampler = useSamplerStore((s) => s.disable);
  const startNote = useSamplerStore((s) => s.startNote);
  const stopNote = useSamplerStore((s) => s.stopNote);

  const addKeyPress = useKeysStore((s) => s.addKeyPress);
  const removeKeyPress = useKeysStore((s) => s.removeKeyPress);

  const onRemotePress = useCallback(
    (msg: ReceivedDataMessage) => {
      if (!msg.from) {
        return;
      }
      const midi = Number(decoder.decode(msg.payload));
      addKeyPress(midi, msg.from);
      startNote(midi);
    },
    [addKeyPress, startNote],
  );

  const onRemoteRelease = useCallback(
    (msg: ReceivedDataMessage) => {
      if (!msg.from) {
        return;
      }
      const midi = Number(decoder.decode(msg.payload));
      removeKeyPress(midi, msg.from);
      stopNote(midi);
    },
    [removeKeyPress, stopNote],
  );

  const { send: liveKitSendPress } = useDataChannel(
    "piano-press",
    onRemotePress,
  );
  const { send: liveKitSendRelease } = useDataChannel(
    "piano-release",
    onRemoteRelease,
  );

  const onNote = useCallback(
    (kind: "press" | "release", midi: number) => {
      if (kind === "press") {
        addKeyPress(midi, localParticipant);
        startNote(midi);
        liveKitSendPress(encoder.encode(midi.toString()), { reliable: false });
      }
      if (kind === "release") {
        removeKeyPress(midi, localParticipant);
        stopNote(midi);
        liveKitSendRelease(encoder.encode(midi.toString()), {
          reliable: false,
        });
      }
    },
    [
      localParticipant,
      addKeyPress,
      removeKeyPress,
      startNote,
      stopNote,
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

  return <Keyboard callback={onNote} />;
};
