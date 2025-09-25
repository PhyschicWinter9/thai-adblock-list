import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  base: "/thai-adblock-list/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: true,
  },
}));
