import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron/simple";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "./",
  
  plugins: [
    tailwindcss(),
    react(),
    electron({
      main: {
        // Main electron process
        entry: "./main.js",
      },
      preload: {
        // Bridge preload
        input: "./preload.js",
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  root: ".",
  build: {
    outDir: "./dist/renderer", // renderer
    emptyOutDir: true,
  },
});
