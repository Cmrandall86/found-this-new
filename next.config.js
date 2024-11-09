/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Use standalone for deployment flexibility if using dynamic routes
};

module.exports = nextConfig;
