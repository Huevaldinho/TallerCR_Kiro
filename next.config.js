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
  
  // Webpack configuration for Docker/WSL2 development
  webpack: (config, { dev, isServer }) => {
    // Use polling for file watching in Docker/WSL2 to avoid ENOMEM errors
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      }
    }
    return config
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