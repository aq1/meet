import { createFileRoute } from "@tanstack/react-router";
import { readMockS3, writeMockS3 } from "@/lib/s3/mock-s3";

export const Route = createFileRoute("/api/mock-s3/$")({
  server: {
    handlers: {
      GET: ({ params }) => readMockS3(params._splat),
      PUT: ({ request, params }) => writeMockS3(request, params._splat),
    },
  },
});
