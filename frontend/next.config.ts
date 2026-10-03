import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://127.0.0.1:5000";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "upha.onrender.com",
        pathname: "/media/**",
      },
    ],
  },
  // Only proxy API/media to local backend in development
  async rewrites() {
    if (isProd) return [];
    return [
      {
        source: "/api/:path*/",
        destination: `${BACKEND_URL}/api/:path*/`,
      },
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${BACKEND_URL}/media/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard/admin",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
