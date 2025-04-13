import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "localhost:8000";

export const socket = io(URL, {
  autoConnect: false,
  path: "/ws/socket.io",
});
