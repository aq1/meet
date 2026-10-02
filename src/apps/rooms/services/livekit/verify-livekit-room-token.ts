import { TokenVerifier } from "livekit-server-sdk";
import { env } from "@/env";

const verifiers = [
  new TokenVerifier(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET),
  new TokenVerifier(env.LIVEKIT_WEBHOOK_API_KEY, env.LIVEKIT_WEBHOOK_API_SECRET),
];

export const verifyLivekitRoomToken = async (token: string, roomName: string) => {
  for (const verifier of verifiers) {
    try {
      const claims = await verifier.verify(token);
      if (claims.video?.room === roomName && claims.video.roomJoin) {
        return claims;
      }
    } catch {}
  }
  return null;
};
