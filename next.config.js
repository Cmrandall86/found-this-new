/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Use standalone for deployment flexibility if using dynamic routes
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=(), geolocation=(), microphone=(), camera=()', // Add valid policies
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
