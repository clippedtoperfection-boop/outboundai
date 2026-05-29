/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds even if TypeScript errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow builds with ESLint warnings
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
