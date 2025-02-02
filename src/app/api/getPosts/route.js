// src/app/api/getPosts/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export async function GET() {
  try {
    // Force a new client instance for this request
    const freshClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: '2024-02-02',
      useCdn: false,
      perspective: 'published'
    });

    const query = `*[_type == "blogPost"] | order(createdAt desc)`;
    
    // Log the query and config for debugging
    console.log('Query:', query);
    console.log('Client config:', freshClient.config());

    const posts = await freshClient.fetch(query, {}, {
      cache: 'no-store'
    });

    console.log('Posts from Sanity:', posts);

    return new NextResponse(JSON.stringify(posts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Error in getPosts:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to fetch posts',
        details: error.message,
        env: {
          hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
          hasToken: !!process.env.SANITY_API_TOKEN
        }
      }),
      { status: 500 }
    );
  }
}
