import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hq")({
  beforeLoad: ({ context, location }) => {
    if (!context.user || context.user.isAnonymous) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    if (context.user.role !== "admin") {
      throw notFound();
    }
    return { user: context.user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-full lg:w-1/2">
        <Outlet />
      </div>
    </div>
  );
}
