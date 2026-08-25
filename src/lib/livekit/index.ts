import type { WebhookEvent } from "livekit-server-sdk";
import { AccessToken, WebhookReceiver } from "livekit-server-sdk";
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
