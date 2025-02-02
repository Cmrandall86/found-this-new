// lib/sanityClient.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET');
if (!token) throw new Error('Missing SANITY_API_TOKEN');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-02-02',
  useCdn: false,
  token,
  perspective: 'published'
});

// Debug logging in production
if (process.env.NODE_ENV === 'production') {
  console.log('Sanity Client Initialized:', {
    projectId: projectId?.substring(0, 4) + '...',
    dataset,
    hasToken: !!token
  });
}

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
