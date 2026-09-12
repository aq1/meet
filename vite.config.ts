import { readFileSync } from "node:fs";
import babel from "@rolldown/plugin-babel";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const version = readFileSync("VERSION", "utf8").trim();
const sentryUpload = Boolean(process.env.SENTRY_AUTH_TOKEN);

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  define: { __APP_VERSION__: JSON.stringify(version) },
  environments: {
    client: { build: { sourcemap: sentryUpload ? "hidden" : false } },
  },
  plugins: [
    devtools(),
    nitro({ preset: "bun", rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    sentryVitePlugin({
      disable: !sentryUpload,
      telemetry: false,
      release: { name: version },
      sourcemaps: { filesToDeleteAfterUpload: [".output/**/*.map"] },
    }),
  ],
});

export default config;
