// lib/sanityClient.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET');
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-02', // Use current date
  useCdn: false, // Disable CDN
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published'
});

// Create image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  if (!source?.asset?._ref) return null;
  
  // Extract a unique identifier from the asset reference
  const assetId = source.asset._ref;
  
  return builder.image(source)
    .width(800)
    .height(600)
    .format('webp') // Specify format
    .quality(80)    // Slightly reduce quality to prevent caching
    .fit('clip')
    .url() + `?v=${encodeURIComponent(assetId)}`; // Add the asset reference as a version parameter
}

export default client;
