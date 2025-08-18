import type { NextConfig } from "next";

const backend = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://127.0.0.1:8787";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      // First-party proxy for PostHog to avoid ad blockers
      { source: "/ph/:path*", destination: "https://us.i.posthog.com/:path*" }
    ];
  },
};

export default nextConfig;
