import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/fresh-batch": {
        target: "https://green-wire-news.mike-663.workers.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fresh-batch/, "/api/stories"),
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
