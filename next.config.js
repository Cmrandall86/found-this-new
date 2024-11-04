/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  };
  
  console.log('SANITY_API_TOKEN:', process.env.SANITY_API_TOKEN);

  module.exports = nextConfig;