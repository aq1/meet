import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="grid gap-2 p-4">
      <h1>Index (public)</h1>
      <Link to="/login">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}
