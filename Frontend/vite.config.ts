import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

// Plain TanStack Start + Vite config: no wrapper package, no external build service.
export default defineConfig(async ({ command }) => ({
  css: {
    transformer: "lightningcss",
  },
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
    // Keep a single copy of these across the dependency graph so hooks/context
    // work correctly when multiple packages depend on them.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
    ignoreOutdatedRequests: true,
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // Route SSR through src/server.ts, our error-wrapping server entry.
      server: { entry: "server" },
    }),
    // Bundle the server for deployment only during `vite build`.
    ...(command === "build" ? [(await import("nitro/vite")).nitro({ preset: "cloudflare-module" })] : []),
    viteReact(),
  ],
}));
