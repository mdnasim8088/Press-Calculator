import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Pages were renamed: keep old bookmarks and installed shortcuts working.
  redirects() {
    return [
      { source: "/roll", destination: "/quantity", permanent: true },
      { source: "/area", destination: "/banner", permanent: true },
    ];
  },
};

export default nextConfig;
