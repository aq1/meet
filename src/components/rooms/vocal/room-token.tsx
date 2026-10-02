import { createContext, useContext } from "react";

export const RoomTokenContext = createContext("");

export const useRoomToken = () => useContext(RoomTokenContext);
