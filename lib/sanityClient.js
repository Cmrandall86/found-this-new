// lib/sanityClient.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01', // Use current date YYYY-MM-DD
  useCdn: false, // Disable CDN to prevent caching issues
  token: process.env.SANITY_API_TOKEN
});

// Create image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  if (!source) return null;
  
  // Add a cache-busting query parameter
  return builder.image(source)
    .auto('format')
    .fit('max')
    .url() + `?t=${Date.now()}`;
}

export default client;
