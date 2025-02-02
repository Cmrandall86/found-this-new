// src/app/api/getPosts/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Disable caching

export async function GET() {
  try {
    // Log environment check first thing
    const envCheck = {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN,
      nodeEnv: process.env.NODE_ENV
    };
    console.log('Environment check:', envCheck);

    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) throw new Error('Missing projectId');
    if (!process.env.NEXT_PUBLIC_SANITY_DATASET) throw new Error('Missing dataset');
    if (!process.env.SANITY_API_TOKEN) throw new Error('Missing token');

    // Create client with basic config first
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: '2024-02-02',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN
    });

    // Try a simple query first
    const testQuery = '*[_type == "blogPost"][0...1]';
    console.log('Testing connection with query:', testQuery);
    
    try {
      const testResult = await client.fetch(testQuery);
      console.log('Test query result:', testResult);
    } catch (testError) {
      console.error('Test query failed:', testError);
      throw new Error(`Test query failed: ${testError.message}`);
    }

    // If we get here, basic connection works, try full query
    const query = `*[_type == "blogPost"] | order(createdAt desc)`;
    console.log('Executing main query');
    
    const posts = await client.fetch(query);
    console.log('Query successful, found posts:', posts?.length);

    return NextResponse.json(posts);

  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      env: {
        hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        projectIdLength: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.length,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: !!process.env.SANITY_API_TOKEN,
        tokenLength: process.env.SANITY_API_TOKEN?.length
      }
    });

    return NextResponse.json({
      error: 'Failed to fetch posts',
      details: error.message,
      env: {
        hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: !!process.env.SANITY_API_TOKEN
      }
    }, { status: 500 });
  }
}
