import { paraglideVitePlugin } from "@inlang/paraglide-js";
import babel from "@rolldown/plugin-babel";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const commitHash = Bun.spawnSync(["git", "rev-parse", "--short", "HEAD"]).stdout.toString().trim();

const config = defineConfig({
  resolve: { tsconfigPaths: true, dedupe: ["react", "react-dom"] },
  define: { __COMMIT_HASH__: JSON.stringify(commitHash) },
  build: { sourcemap: "hidden" },
  optimizeDeps: {
    // "bun" is a runtime builtin, so the dev dependency scanner should not try to resolve it
    exclude: ["bun"],
    include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  plugins: [
    paraglideVitePlugin({ project: "./project.inlang", outdir: "./src/paraglide" }),
    devtools(),
    nitro({ preset: "bun", sourcemap: true }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    sentryTanstackStart({
      telemetry: false,
      release: { create: false },
      sourcemaps: { disable: true },
      tunnelRoute: true,
    }),
  ],
});

export default config;
