export async function captureException(error: unknown) {
  if (import.meta.env.SSR) return;
  const Sentry = await import("@sentry/tanstackstart-react");
  Sentry.captureException(error);
}
