import { EncodedFileOutput, EncodedFileType, type WebhookEvent } from "livekit-server-sdk";
import { egressClient } from "@/apps/rooms/services/livekit/egress-client";
import { env } from "@/env";

export const roomStartedEventHandler = async (event: WebhookEvent) => {
  if (!event.room?.name) {
    return;
  }

  if (!env.EGRESS_TEMPLATE_URL) {
    throw new Error("EGRESS_TEMPLATE_URL is not configured");
  }

  const prefix = "{room_name}/recording";

  return await egressClient.startRoomCompositeEgress(
    event.room.name,
    {
      file: new EncodedFileOutput({
        fileType: EncodedFileType.MP4,
        filepath: `${prefix}/{time}.mp4`,
      }),
    },
    {
      customBaseUrl: env.EGRESS_TEMPLATE_URL,
    },
  );
};
