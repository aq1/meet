import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [emailOTPClient(), anonymousClient()],
});
