import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserStore = {
  username: string;
  updateUsername: (username: string) => void;
};

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      username: "",
      updateUsername: (username: string) => set({ username }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
