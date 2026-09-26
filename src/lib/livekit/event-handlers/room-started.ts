import { EncodedFileOutput, EncodedFileType, type WebhookEvent } from "livekit-server-sdk";
import { env } from "#/env";
import { egressClient } from "#/lib/livekit/egress-client";

export const roomStartedEventHandler = async (event: WebhookEvent) => {
  if (!event.room?.name) {
    return;
  }

  if (!env.EGRESS_TEMPLATE_URL) {
    throw new Error("EGRESS_TEMPLATE_URL is not configured");
  }

  const prefix = `${new Date().toISOString().slice(0, 10)}/{room_name}`;

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
