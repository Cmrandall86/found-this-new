// lib/sanityClient.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01', // Use current date YYYY-MM-DD
  useCdn: true, // Set to false if you want to ensure fresh data
  token: process.env.SANITY_API_TOKEN // This is important for authentication
});

export default client;
