import { mkdir } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";

const MOCK_S3_DIR = resolve(".mock-s3");

const resolveTarget = (splat?: string) => {
  const target = resolve(MOCK_S3_DIR, splat ?? "");
  return target.startsWith(MOCK_S3_DIR + sep) ? target : null;
};

export const readMockS3 = async (splat?: string) => {
  if (!import.meta.env.DEV) {
    return new Response(null, { status: 404 });
  }
  const target = resolveTarget(splat);
  if (!target) {
    return new Response(null, { status: 400 });
  }
  const file = Bun.file(target);
  if (!(await file.exists())) {
    return new Response(null, { status: 404 });
  }
  return new Response(file);
};

export const writeMockS3 = async (request: Request, splat?: string) => {
  if (!import.meta.env.DEV) {
    return new Response(null, { status: 404 });
  }
  const target = resolveTarget(splat);
  if (!target) {
    return new Response(null, { status: 400 });
  }
  await mkdir(dirname(target), { recursive: true });
  await Bun.write(target, await request.arrayBuffer());
  return new Response(null, { status: 200 });
};
