import type { NextConfig } from "next";

// Dev only: lets `next dev` serve its scripts to the extra origins allowed to sign in
// (e.g. the LAN IP, to test from a phone), not just localhost.
const devOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => new URL(origin).hostname);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: devOrigins,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Cloudinary resizes the images (src/lib/cloudinary-loader.ts), not this server.
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
    // Still the only allowed image host: URLs are validated against it (schemas/common.ts).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  reactCompiler: true,
  experimental: {
    // There are two root layouts (site and admin), so unmatched URLs need
    // src/app/global-not-found.tsx.
    globalNotFound: true,
  },
};

export default nextConfig;
