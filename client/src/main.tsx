import "@radix-ui/themes/styles.css";
import "./style.css";
import "remixicon/fonts/remixicon.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Heading, Theme } from "@radix-ui/themes";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent,
  defaultErrorComponent,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function defaultNotFoundComponent() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Heading>NOT FOUND</Heading>
    </div>
  );
}

function defaultErrorComponent() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Heading>ERROR, SORRY</Heading>
    </div>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Theme appearance="dark">
        <RouterProvider router={router} />
      </Theme>
    </StrictMode>
  );
}
