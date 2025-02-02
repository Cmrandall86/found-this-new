// src/app/api/getPosts/route.js
import { NextResponse } from 'next/server';
import client from '../../../../lib/sanityClient';

export async function GET() {
  try {
    // Verify client is properly initialized
    if (!client.config()) {
      throw new Error('Sanity client not properly initialized');
    }

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
    }`;

    const posts = await client.fetch(query, {}, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!Array.isArray(posts)) {
      throw new Error('Invalid response format from Sanity');
    }

    console.log(`Successfully fetched ${posts.length} posts`);

    return new NextResponse(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error in getPosts:', {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to fetch posts',
        message: error.message,
        sanityConfig: {
          hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
          hasToken: !!process.env.SANITY_API_TOKEN
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
