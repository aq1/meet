import { createServerFn } from "@tanstack/react-start";
import { roomServiceClient } from "@/apps/rooms/services/livekit/room-service-client";
import { roomOwnerMiddleware } from "../middleware/room-owner-middleware";

export const endRoomServerFn = createServerFn({ method: "POST" })
  .middleware([roomOwnerMiddleware])
  .handler(async ({ context }) => {
    await roomServiceClient.deleteRoom(context.room.publicId);
  });
