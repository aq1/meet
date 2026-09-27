import { mkdir } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { createFileRoute } from "@tanstack/react-router";

const MOCK_S3_DIR = resolve(".mock-s3");

export const Route = createFileRoute("/api/mock-s3/$")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        if (!import.meta.env.DEV) {
          return new Response(null, { status: 404 });
        }
        const target = resolve(MOCK_S3_DIR, params._splat ?? "");
        if (!target.startsWith(MOCK_S3_DIR + sep)) {
          return new Response(null, { status: 400 });
        }
        await mkdir(dirname(target), { recursive: true });
        await Bun.write(target, await request.arrayBuffer());
        return new Response(null, { status: 200 });
      },
    },
  },
});
