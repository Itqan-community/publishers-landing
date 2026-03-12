import type { NextConfig } from "next";

function getRemoteImagePatterns() {
  const raw = process.env.NEXT_IMAGE_ALLOWED_HOSTS || "";
  const hosts = raw
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  // If no env is configured yet, fall back to the current permissive behavior.
  if (!hosts.length) {
    return [
      {
        protocol: "https" as const,
        hostname: "**",
      },
    ];
  }

  return hosts.map((host) => ({
    protocol: "https" as const,
    hostname: host,
  }));
}

const nextConfig: NextConfig = {
  // Enable static optimization where possible
  reactStrictMode: true,

  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Image optimization
  images: {
    // Many of our "png" assets in /public are actually inline SVG content (exported from Figma).
    // Allow SVGs so Next/Image doesn't throw at runtime (which can cause 500s in dev).
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: getRemoteImagePatterns(),
  },

  // Headers for multi-tenant support
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

