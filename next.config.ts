import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization where possible
  reactStrictMode: true,
  
  // Image optimization
  images: {
    // Many of our "png" assets in /public are actually inline SVG content (exported from Figma).
    // Allow SVGs so Next/Image doesn't throw at runtime (which can cause 500s in dev).
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.cms.itqan.dev",
      },
      {
        protocol: "https",
        hostname: "staging.api.cms.itqan.dev",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },

  // Security + performance headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

