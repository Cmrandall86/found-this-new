// src/app/api/getPosts/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export async function GET() {
  try {
    // Log environment variables (safely)
    console.log('Environment check:', {
      hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN,
      nodeEnv: process.env.NODE_ENV
    });

    // Force a new client instance for this request
    const freshClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: '2024-02-02',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN // Include token for authentication
    });

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

    try {
      const posts = await freshClient.fetch(query);
      console.log('Successfully fetched posts:', posts);

      return NextResponse.json(posts);
    } catch (fetchError) {
      console.error('Sanity fetch error:', {
        message: fetchError.message,
        details: fetchError.details,
        statusCode: fetchError.statusCode
      });
      
      throw fetchError; // Re-throw to be caught by outer try-catch
    }

  } catch (error) {
    console.error('Error in getPosts:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json({
      error: 'Failed to fetch posts',
      details: error.message,
      type: error.name,
      env: {
        hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: !!process.env.SANITY_API_TOKEN
      }
    }, { status: 500 });
  }
}
