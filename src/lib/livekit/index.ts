import { AccessToken } from "livekit-server-sdk";
import { env } from "#/env";

export const grantLivekitToken = async (
  username: string,
  roomName: string,
) => {
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
