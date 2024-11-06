// lib/sanityClient.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'szt6zdnb',  // Replace with your Sanity project ID
  dataset: 'production',   // Your dataset name
  apiVersion: '2023-01-01', // Date of Sanity’s API version to use
  useCdn: false,            // Set to false to ensure no caching from CDN
  token: process.env.SANITY_API_TOKEN,  // Your API token, ensure this is in your .env file
});

export default client;
