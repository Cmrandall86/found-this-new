// src/app/api/getPosts/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Disable caching

export async function GET() {
  try {
    // Create a fresh client for each request
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: '2024-02-02',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
      ignoreBrowserTokenWarning: true
    });

    // Log configuration (safely)
    console.log('Sanity Configuration:', {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.substring(0, 4) + '...',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN,
      timestamp: new Date().toISOString() // Add timestamp to verify fresh requests
    });

    // Query with explicit timestamp to bust cache
    const timestamp = new Date().getTime();
    const query = `*[_type == "blogPost"] | order(createdAt desc) {
      _id,
      title,
      description,
      productURL,
      price,
      previewImage,
      previewTitle,
      previewDescription,
      createdAt,
      updatedAt,
      tags
    }[@ != null] {
      ...,
      "_timestamp": "${timestamp}"
    }`;

    const posts = await client.fetch(query, {}, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    // Compare with known good data
    console.log(`Fetched ${posts.length} posts at ${new Date().toISOString()}`);
    console.log('Post IDs:', posts.map(p => p._id));

    return new NextResponse(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '-1',
        'Surrogate-Control': 'no-store',
        'X-Fetch-Time': new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      config: {
        hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: !!process.env.SANITY_API_TOKEN
      }
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to fetch posts',
        details: error.message,
        time: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
