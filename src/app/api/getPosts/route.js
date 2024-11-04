import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: 'szt6zdnb',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN, // Ensure you have this set in .env.local
});

export async function GET() {
  try {
    const posts = await client.fetch('*[_type == "blogPost"]');
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error); // Log error for debugging
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}
