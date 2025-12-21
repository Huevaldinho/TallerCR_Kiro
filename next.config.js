/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Enable strict mode for better type safety
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't ignore ESLint errors during builds
    ignoreDuringBuilds: false,
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