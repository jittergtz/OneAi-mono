/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.env.NODE_ENV === 'production' 
      ? undefined 
      : process.cwd(),
  }
}

module.exports = nextConfig
