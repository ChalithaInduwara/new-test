import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Generates 404.html for GitHub Pages SPA routing fallback
const copy404Plugin = () => ({
  name: "copy-404-plugin",
  closeBundle() {
    try {
      const indexHtml = path.resolve("dist/index.html");
      const notFoundHtml = path.resolve("dist/404.html");
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml);
      }
    } catch (e) {
      console.warn("Could not copy 404.html", e);
    }
  },
});

export default defineConfig(({ command }) => ({
  plugins: [react(), copy404Plugin()],
  // In development, serve from root "/" so http://localhost:5173/ works without 404.
  // In production build, serve from "/new-test/" for GitHub Pages.
  base: command === "serve" ? "/" : "/new-test/",
}));