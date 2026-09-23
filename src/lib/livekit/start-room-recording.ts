import { EncodedFileOutput, EncodedFileType, SegmentedFileOutput } from "livekit-server-sdk";
import { env } from "#/env";
import { egressClient } from "#/lib/livekit/egress-client";

export const startRoomRecording = async (roomName: string) => {
  if (!env.EGRESS_TEMPLATE_URL) {
    throw new Error("EGRESS_TEMPLATE_URL is not configured");
  }

  const prefix = `${new Date().toISOString().slice(0, 10)}/{room_name}`;

  return await egressClient.startRoomCompositeEgress(
    roomName,
    {
      file: new EncodedFileOutput({
        fileType: EncodedFileType.MP4,
        filepath: `${prefix}/{time}.mp4`,
      }),
      segments: new SegmentedFileOutput({
        filenamePrefix: `segments/{time}`,
        playlistName: `${prefix}/{time}.m3u8`,
        livePlaylistName: `${prefix}/{time}-live.m3u8`,
        segmentDuration: 6,
      }),
    },
    {
      customBaseUrl: env.EGRESS_TEMPLATE_URL,
    },
  );
};
