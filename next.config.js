/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['nodemailer']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('nodemailer')
    }
    return config
  }
}

module.exports = nextConfig