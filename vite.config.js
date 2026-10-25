import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Path to user downloaded video asset
const DOWNLOADED_VIDEO_PATH = "C:/Users/User/Downloads/15451-264243720_medium.mp4";

// Ensure dark mode background video is present in public/videos
const syncDarkModeVideo = () => {
  try {
    const publicVideosDir = path.resolve("public/videos");
    const targetVideoPath = path.resolve(publicVideosDir, "dark-mode-bg.mp4");

    if (!fs.existsSync(publicVideosDir)) {
      fs.mkdirSync(publicVideosDir, { recursive: true });
    }

    if (fs.existsSync(DOWNLOADED_VIDEO_PATH)) {
      if (!fs.existsSync(targetVideoPath) || fs.statSync(targetVideoPath).size !== fs.statSync(DOWNLOADED_VIDEO_PATH).size) {
        fs.copyFileSync(DOWNLOADED_VIDEO_PATH, targetVideoPath);
        console.log("Successfully copied dark mode video to public/videos/dark-mode-bg.mp4");
      }
    }
  } catch (err) {
    console.warn("Notice: Could not auto-sync dark mode video:", err.message);
  }
};

// Immediately attempt sync on config evaluation
syncDarkModeVideo();

// Vite plugin for video streaming and production asset bundling
const darkModeVideoPlugin = () => ({
  name: "dark-mode-video-plugin",
  buildStart() {
    syncDarkModeVideo();
  },
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const cleanUrl = req.url ? req.url.split("?")[0] : "";
      if (cleanUrl.endsWith("/videos/dark-mode-bg.mp4") || cleanUrl === "/videos/dark-mode-bg.mp4") {
        const publicFile = path.resolve("public/videos/dark-mode-bg.mp4");
        const fileToServe = fs.existsSync(publicFile)
          ? publicFile
          : (fs.existsSync(DOWNLOADED_VIDEO_PATH) ? DOWNLOADED_VIDEO_PATH : null);

        if (fileToServe) {
          try {
            const stat = fs.statSync(fileToServe);
            const range = req.headers.range;

            if (range) {
              const parts = range.replace(/bytes=/, "").split("-");
              const start = parseInt(parts[0], 10);
              const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
              const chunksize = end - start + 1;
              const fileStream = fs.createReadStream(fileToServe, { start, end });

              res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${stat.size}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4",
              });
              return fileStream.pipe(res);
            } else {
              res.writeHead(200, {
                "Content-Length": stat.size,
                "Content-Type": "video/mp4",
              });
              return fs.createReadStream(fileToServe).pipe(res);
            }
          } catch (e) {
            console.error("Error serving dark mode video:", e);
          }
        }
      }
      next();
    });
  },
  closeBundle() {
    try {
      // Ensure 404 fallback for GitHub Pages
      const indexHtml = path.resolve("dist/index.html");
      const notFoundHtml = path.resolve("dist/404.html");
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml);
      }

      // Ensure video is also present in dist/videos
      const distVideosDir = path.resolve("dist/videos");
      const distVideoPath = path.resolve(distVideosDir, "dark-mode-bg.mp4");
      const publicVideoPath = path.resolve("public/videos/dark-mode-bg.mp4");
      const srcVideo = fs.existsSync(publicVideoPath)
        ? publicVideoPath
        : (fs.existsSync(DOWNLOADED_VIDEO_PATH) ? DOWNLOADED_VIDEO_PATH : null);

      if (srcVideo) {
        if (!fs.existsSync(distVideosDir)) {
          fs.mkdirSync(distVideosDir, { recursive: true });
        }
        if (!fs.existsSync(distVideoPath) || fs.statSync(distVideoPath).size !== fs.statSync(srcVideo).size) {
          fs.copyFileSync(srcVideo, distVideoPath);
          console.log("Successfully copied dark mode video to dist/videos/dark-mode-bg.mp4");
        }
      }
    } catch (e) {
      console.warn("Could not copy 404.html or dist video assets", e);
    }
  },
});

export default defineConfig(({ command }) => ({
  plugins: [react(), darkModeVideoPlugin()],
  // In development, serve from root "/" so http://localhost:5173/ works without 404.
  // In production build, serve from "/new-test/" for GitHub Pages.
  base: command === "serve" ? "/" : "/new-test/",
}));