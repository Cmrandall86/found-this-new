// lib/sanityClient.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,  // Use env variable
  dataset: process.env.REACT_APP_SANITY_DATASET,       // Use env variable
  apiVersion: '2023-01-01',                            // Date of Sanity’s API version to use
  useCdn: false,                                       // Set to false to ensure no caching from CDN
  token: process.env.REACT_APP_SANITY_TOKEN,           // Use correct env variable
});

export default client;
