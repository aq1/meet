import { createMiddleware } from "@tanstack/react-start";

export const publicMiddleware = createMiddleware({ type: "function" }).server(({ next }) => next());
