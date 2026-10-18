import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets `next dev` serve its scripts when opened via the LAN IP, not just localhost.
  allowedDevOrigins: ["192.168.0.29"],
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
