import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test/")({
  component: TestPage,
});


function TestPage() {
  const triggerError = () => {
    throw new Error("Test Error")
  }

  return (
    <div className="size-full flex justify-center items-center"><button onClick={triggerError}>Trigger Error</button></div>
  );
}

