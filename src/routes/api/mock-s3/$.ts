import { mkdir } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { createFileRoute } from "@tanstack/react-router";

const MOCK_S3_DIR = resolve(".mock-s3");

const resolveTarget = (splat?: string) => {
  const target = resolve(MOCK_S3_DIR, splat ?? "");
  return target.startsWith(MOCK_S3_DIR + sep) ? target : null;
};

export const Route = createFileRoute("/api/mock-s3/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!import.meta.env.DEV) {
          return new Response(null, { status: 404 });
        }
        const target = resolveTarget(params._splat);
        if (!target) {
          return new Response(null, { status: 400 });
        }
        const file = Bun.file(target);
        if (!(await file.exists())) {
          return new Response(null, { status: 404 });
        }
        return new Response(file);
      },
      PUT: async ({ request, params }) => {
        if (!import.meta.env.DEV) {
          return new Response(null, { status: 404 });
        }
        const target = resolveTarget(params._splat);
        if (!target) {
          return new Response(null, { status: 400 });
        }
        await mkdir(dirname(target), { recursive: true });
        await Bun.write(target, await request.arrayBuffer());
        return new Response(null, { status: 200 });
      },
    },
  },
});
