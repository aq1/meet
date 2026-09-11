import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/test/")({
  component: TestPage,
});

function TestPage() {
  const triggerError = () => {
    throw new Error("Test Error");
  };

  return (
    <div className="flex size-full items-center justify-center">
      <button type="button" onClick={triggerError}>
        Trigger Error
      </button>
    </div>
  );
}
