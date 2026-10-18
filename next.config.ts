import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets `next dev` serve its scripts when opened via the LAN IP, not just localhost.
  allowedDevOrigins: ["192.168.0.29"],
  images: {
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
