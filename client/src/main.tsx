import "@radix-ui/themes/styles.css";
import "./style.css";
import "remixicon/fonts/remixicon.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
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
