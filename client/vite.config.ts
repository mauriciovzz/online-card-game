import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  envDir: "../",
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Uno online",
        short_name: "Uno online",
        description: "An app to play uno online!",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        start_url: ".",
        scope: ".",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "icons/favicon.ico",
            type: "image/x-icon",
            sizes: "16x16 32x32",
          },
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-192-maskable.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "maskable",
          },
          {
            src: "/icon-512-maskable.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*"],
        navigateFallback: "/index.html",
      },
      includeAssets: ["**/*"],
    }),
  ],
});
