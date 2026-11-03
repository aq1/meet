import { create } from "zustand";

type RoomStoreDataT = {
  publicId: string;
  startedAt: Date | null;
};

type RoomStoreT = RoomStoreDataT & {
  update: (data: RoomStoreDataT) => void;
};

export const useRoomStore = create<RoomStoreT>()((set) => ({
  publicId: "",
  startedAt: null,
  update: (data) => {
    set(data);
  },
}));
