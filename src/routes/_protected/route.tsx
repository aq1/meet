import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/apps/auth/functions/get-session";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (!session || session.user.isAnonymous) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { user: session.user };
  },
  component: Outlet,
});
