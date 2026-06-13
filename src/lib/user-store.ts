import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserStore = {
  username: string;
  password: string;
  updateUsername: (username: string) => void;
  updatePassword: (password: string) => void;
};

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      username: "",
      password: "",
      updateUsername: (username: string) => {
        set({ username });
      },
      updatePassword: (password: string) => {
        set({ password });
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
