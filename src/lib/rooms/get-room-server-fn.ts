import { createServerFn } from "@tanstack/react-start";
import { roomExists } from "#/lib/db/rooms/room-exists";

export const getRoomServerFn = createServerFn({ method: "GET" })
  .validator((roomId: string) => roomId)
  .handler(async ({ data }) => ({ exists: await roomExists(data) }));
