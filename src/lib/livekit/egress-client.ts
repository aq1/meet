import { EgressClient } from "livekit-server-sdk";
import { env } from "#/env";

export const egressClient = new EgressClient(
  env.LIVEKIT_URL,
  env.LIVEKIT_WEBHOOK_API_KEY,
  env.LIVEKIT_WEBHOOK_API_SECRET,
  { requestTimeout: 60 },
);
