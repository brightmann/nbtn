/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Leave unset for Workers root hosting; Pages sets /nbtn.
  basePath: process.env.NEXT_BASE_PATH || '',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  }
}

module.exports = nextConfig
