import type { NextConfig } from "next";

const rawBasePath = process.env.BASE_PATH;
const basePath =
  rawBasePath && rawBasePath !== "/"
    ? rawBasePath.replace(/\/$/, "")
    : "";
const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;

const nextConfig: NextConfig = {
  basePath,
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.replit.dev",
    ...(replitDevDomain ? [replitDevDomain] : []),
  ],
  agentRules: false,
};

export default nextConfig;
