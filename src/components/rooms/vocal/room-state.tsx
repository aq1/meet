import { create } from "zustand";

type RoomStoreDataT = {
  publicId: string;
  startedAt: Date | null;
  isOwner: boolean;
};

type RoomStoreT = RoomStoreDataT & {
  update: (data: RoomStoreDataT) => void;
};

export const useRoomStore = create<RoomStoreT>()((set) => ({
  publicId: "",
  startedAt: null,
  isOwner: false,
  update: (data) => {
    set(data);
  },
}));
