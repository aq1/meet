import { z } from "zod";
import { create } from "zustand";

export const AudioSyncSchema = z
  .string()
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Invalid JSON",
      });
      return z.NEVER;
    }
  })
  .pipe(
    z.object({
      key: z.string().min(1),
      action: z.enum(["play", "pause"]),
      time: z.number().nonnegative(),
    }),
  );

export type AudioSync = z.infer<typeof AudioSyncSchema>;

interface AudioSyncState {
  sync: AudioSync | null;
  send: ((msg: AudioSync) => void) | null;
  receive: (msg: AudioSync) => void;
  control: (msg: AudioSync) => void;
}

export const useAudioSync = create<AudioSyncState>((set, get) => ({
  sync: null,
  send: null,
  receive: (msg) => set({ sync: { ...msg } }),
  control: (msg) => {
    set({ sync: { ...msg } });
    get().send?.(msg);
  },
}));
