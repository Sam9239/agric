import devServer from "@hono/vite-dev-server"
import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
    inspectAttr(),
    react(),
  ],
  server: {
    port: 3000,
    allowedHosts: [
      ".trycloudflare.com",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      "db": path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@tanstack") || id.includes("@trpc") || id.includes("superjson")) {
            return "data-vendor";
          }
          if (id.includes("@radix-ui") || id.includes("cmdk") || id.includes("vaul")) {
            return "ui-vendor";
          }
          if (id.includes("framer-motion")) {
            return "motion-vendor";
          }
          // Admin-only heavyweights: keep them out of the shared vendor chunk
          // so public pages never download them.
          if (id.includes("recharts") || id.includes("d3-") || id.includes("victory-vendor")) {
            return "charts-vendor";
          }
          if (id.includes("date-fns") || id.includes("react-day-picker") || id.includes("react-easy-crop")) {
            return "admin-vendor";
          }
          // Core React only — matching every "react-*" package created a
          // circular react-vendor <-> vendor chunk dependency.
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return "react-vendor";
          }
          return "vendor";
        },
      },
    },
  },
});
