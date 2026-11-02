import { createServerFn } from "@tanstack/react-start";
import { roomServiceClient } from "@/apps/rooms/services/livekit/room-service-client";
import { adminMiddleware } from "../middleware/admin-middleware";
import { z } from "zod";

export const deleteRoomFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ roomId: z.string().min(1) }))
  .handler(async ({ data }) => {
    await roomServiceClient.deleteRoom(data.roomId);
  });
