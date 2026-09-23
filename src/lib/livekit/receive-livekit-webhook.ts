import type { WebhookEvent } from "livekit-server-sdk";
import { WebhookReceiver } from "livekit-server-sdk";
import { env } from "#/env";

const webhookReceiver = new WebhookReceiver(env.LIVEKIT_WEBHOOK_API_KEY, env.LIVEKIT_WEBHOOK_API_SECRET);

export type LivekitWebhookResult = { event: WebhookEvent; error?: undefined } | { event?: undefined; error: Error };

export const receiveLivekitWebhook = async (request: Request): Promise<LivekitWebhookResult> => {
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
