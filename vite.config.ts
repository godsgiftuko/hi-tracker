import { defineConfig } from "vite";
import { join } from "path";

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: join(process.cwd(), "dist"),
    emptyOutDir: true,
  },
});
