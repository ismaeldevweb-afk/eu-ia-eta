import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: rootDir,
  },
  trailingSlash: true,
};

export default nextConfig;
