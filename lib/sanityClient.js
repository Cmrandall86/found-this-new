// lib/sanityClient.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,  // Should match .env.local
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,       // Should match .env.local
  apiVersion: '2023-01-01',                              // Your preferred Sanity API version
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,                   // Your API token
});

export default client;
