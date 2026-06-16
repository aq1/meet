import { useDataChannel, useLocalParticipant } from "@livekit/components-react";
import { useCallback, useEffect } from "react";
import { usePianoStore } from "./stores/piano";
import type { Participant } from "livekit-client";
import { Keyboard } from "./Keyboard";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const Piano = () => {
  const { localParticipant } = useLocalParticipant();

  const { send: liveKitSendPress } = useDataChannel("piano-press", (msg) => {
    if (!msg.from) {
      return;
    }
    usePianoStore
      .getState()
      .addPress(Number(decoder.decode(msg.payload)), msg.from);
  });

  const { send: liveKitSendRelease } = useDataChannel(
    "piano-release",
    (msg) => {
      if (!msg.from) {
        return;
      }
      usePianoStore
        .getState()
        .removePress(Number(decoder.decode(msg.payload)), msg.from);
    },
  );

  const onPress = useCallback(
    async (midi: number, participant: Participant) => {
      if (!participant.isLocal) {
        return;
      }
      await liveKitSendPress(encoder.encode(midi.toString()), {
        reliable: false,
      });
    },
    [liveKitSendPress],
  );

  const onRelease = useCallback(
    async (midi: number, participant: Participant) => {
      if (!participant.isLocal) {
        return;
      }
      await liveKitSendRelease(encoder.encode(midi.toString()), {
        reliable: false,
      });
    },
    [liveKitSendRelease],
  );

  useEffect(() => {
    console.log("PIANO INIT")
    document.body?.scrollIntoView({ inline: "center", block: "nearest" });

    const { enable, disable } = usePianoStore.getState();
    enable(localParticipant, onPress, onRelease);

    return () => {
      disable();
    };
  }, [localParticipant, onPress, onRelease]);

  return <Keyboard onPress={() => { }} onRelease={() => { }} />;
};
