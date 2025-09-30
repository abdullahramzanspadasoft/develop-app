/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['nodemailer']
  },
  // Disable webpack cache to avoid caching errors
  webpack: (config, { isServer, dev }) => {
    // Disable caching for problematic packages
    config.cache = false
    
    if (isServer) {
      config.externals.push('nodemailer')
    }
    
    // Optimize for production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/
            }
          }
        }
      }
    }
    
    return config
  }
}

module.exports = nextConfig