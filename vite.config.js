import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron/simple";

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Processo principal do Electron
        entry: "../main.js",
      },
      preload: {
        // Bridge preload
        input: "./preload.js",
      },
    }),
  ],
  root: "src",
  build: {
    outDir: "../dist/renderer", // renderer separado
    emptyOutDir: true,
    base: "./", // importante para abrir no file:// no build
  },
});
