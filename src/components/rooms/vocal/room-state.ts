import { Room } from "livekit-client";
import { create } from "zustand";

const encoder = new TextEncoder();

interface LivekitState {
  room: Room;
  sendMidi: (midi: number, on: boolean) => void;
  sendChat: (username: string, text: string) => void;
}

export type MidiMessage = { type: "midi"; midi: number; on: boolean };
export type ChatMessage = { type: "chat"; username: string; text: string };
export type Message = MidiMessage | ChatMessage;

export const useLivekit = create<LivekitState>((_, get) => ({
  room: new Room({ adaptiveStream: true, dynacast: true }),
  sendMidi: (midi: number, on: boolean) => {
    const data = { type: "midi", midi, on };
    get().room.localParticipant.publishData(
      encoder.encode(JSON.stringify(data)),
      { reliable: false },
    );
  },
  sendChat: (username: string, text: string) => {
    const data = { type: "chat", text, username };
    get().room.localParticipant.publishData(
      encoder.encode(JSON.stringify(data)),
      { reliable: true },
    );
  },
}));
