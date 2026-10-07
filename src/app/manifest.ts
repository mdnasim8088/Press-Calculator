import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Press Calculator",
    short_name: "Press Calc",
    description: "Calculator for printing, stickers, cutter stickers, banners and vinyl.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#071216",
    theme_color: "#071216",
    icons: [
      // Built from brand/source by scripts/build-brand.mjs
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
