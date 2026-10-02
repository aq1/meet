import { readFileSync } from "node:fs";
import babel from "@rolldown/plugin-babel";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const version = readFileSync("VERSION", "utf8").trim();
const sentryUpload = Boolean(process.env.SENTRY_AUTH_TOKEN);

const config = defineConfig({
  resolve: { tsconfigPaths: true, dedupe: ["react", "react-dom"] },
  define: { __APP_VERSION__: JSON.stringify(version) },
  optimizeDeps: {
    // "bun" is a runtime builtin, so the dev dependency scanner should not try to resolve it
    exclude: ["bun"],
    include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  plugins: [
    devtools(),
    nitro({ preset: "bun" }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    sentryTanstackStart({
      telemetry: false,
      release: { name: version, create: sentryUpload },
      sourcemaps: { disable: !sentryUpload, filesToDeleteAfterUpload: [".output/**/*.map"] },
      tunnelRoute: true,
    }),
  ],
});

export default config;
