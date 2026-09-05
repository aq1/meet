import type { WebhookEvent } from "livekit-server-sdk";
import {
  AccessToken,
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
  EncodingOptionsPreset,
  WebhookReceiver,
} from "livekit-server-sdk";
import { env } from "#/env";

export const grantLivekitToken = async (username: string, roomName: string) => {
  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: username,
  });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  return {
    token: await at.toJwt(),
    wss: env.LIVEKIT_URL,
  };
};

const webhookReceiver = new WebhookReceiver(
  env.LIVEKIT_WEBHOOK_API_KEY,
  env.LIVEKIT_WEBHOOK_API_SECRET,
);

export type LivekitWebhookResult =
  | { event: WebhookEvent; error?: undefined }
  | { event?: undefined; error: Error };

export const receiveLivekitWebhook = async (
  request: Request,
): Promise<LivekitWebhookResult> => {
  try {
    const event = await webhookReceiver.receive(
      await request.text(),
      request.headers.get("authorization") ?? undefined,
    );
    return { event };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
};

const egressClient = new EgressClient(
  env.LIVEKIT_URL,
  env.LIVEKIT_WEBHOOK_API_KEY,
  env.LIVEKIT_WEBHOOK_API_SECRET,
  { requestTimeout: 60 },
);

export const startRoomRecording = async (roomName: string) => {
  if (!env.EGRESS_TEMPLATE_URL) {
    throw new Error("EGRESS_TEMPLATE_URL is not configured");
  }
  return await egressClient.startRoomCompositeEgress(
    roomName,
    new EncodedFileOutput({
      fileType: EncodedFileType.MP4,
      filepath: "{room_name}-{time}.mp4",
    }),
    {
      customBaseUrl: env.EGRESS_TEMPLATE_URL,
      encodingOptions: EncodingOptionsPreset.H264_1080P_30,
    },
  );
};

export const stopRoomRecording = async (roomName: string) => {
  const active = await egressClient.listEgress({ roomName, active: true });
  return await Promise.all(
    active.map((info) => egressClient.stopEgress(info.egressId)),
  );
};
