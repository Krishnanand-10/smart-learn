/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', '@napi-rs/canvas', 'pg', 'better-sqlite3'],
  },
};

export default nextConfig;
