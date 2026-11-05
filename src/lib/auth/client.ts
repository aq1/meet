import { adminClient, anonymousClient, emailOTPClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [emailOTPClient(), anonymousClient(), adminClient(), organizationClient()],
});
