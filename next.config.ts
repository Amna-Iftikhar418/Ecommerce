import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    qualities: [65, 70, 75],
  },
  experimental: {
    imgOptTimeoutInSeconds: 30,
    inlineCss: true,
  },
};

export default nextConfig;
