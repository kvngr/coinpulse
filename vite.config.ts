import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import vercel from "vite-plugin-vercel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vercel()],
  esbuild: {
    target: "es2022",
  },
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "src/domain"),
      "@application": path.resolve(__dirname, "src/application"),
      "@infrastructure": path.resolve(__dirname, "src/infrastructure"),
      "@ui": path.resolve(__dirname, "src/ui"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@config": path.resolve(__dirname, "src/config"),
    },
  },
});
