import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Proxy Express API calls through the client domain: the browser only
  // ever talks to one host, so a flaky route to the server host cannot
  // break the app (and same-origin calls need no CORS). The Stripe
  // webhook still hits the server directly — it is unaffected.
  async rewrites() {
    return [
      {
        source: "/api/server/:path*",
        destination:
          "https://assignment09-mentorlagbe-server.vercel.app/:path*",
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
