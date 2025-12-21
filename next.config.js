/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  typescript: {
    // Enable strict mode for better type safety
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ignore ESLint during builds since we run it separately in CI
    // This avoids the circular structure error during Docker builds
    ignoreDuringBuilds: true,
  },
  // Experimental features
  experimental: {},
  // PWA configuration will be added later with next-pwa
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
}

module.exports = nextConfig