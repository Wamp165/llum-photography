import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets `next dev` serve its scripts when opened via the LAN IP, not just localhost.
  allowedDevOrigins: ["192.168.0.29"],
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
