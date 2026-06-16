/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ['172.22.64.1', '172.29.48.1', '172.24.208.1', '192.168.50.157'],
}

export default nextConfig