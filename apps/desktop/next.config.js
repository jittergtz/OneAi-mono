/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // This ensures that static assets are properly accessible
  assetPrefix: './',
  trailingSlash: false, // Add this if you want /settings instead of /settings/
  // Configure image optimization for static export
};

module.exports = nextConfig;