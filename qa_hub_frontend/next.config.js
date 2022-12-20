/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_QA_HUB_BACKEND: process.env.NEXT_PUBLIC_QA_HUB_BACKEND
  }
}

module.exports = nextConfig
