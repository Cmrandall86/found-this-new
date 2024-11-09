/** @type {import('next').NextConfig} */
const sanityClient = require('@sanity/client');

// Create the Sanity client for fetching data
const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN, // Add token for authenticated requests if needed
});

const nextConfig = {
  reactStrictMode: true,
  async exportPathMap(defaultPathMap) {
    const paths = await client
      .fetch('*[_type == "post"].slug.current')
      .then(slugs =>
        slugs.reduce((acc, slug) => {
          acc[`/blog/${slug}`] = { page: '/blog', query: { slug } };
          return acc;
        }, { '/': { page: '/' } })
      );
    return paths;
  },
};

module.exports = nextConfig;
