import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: 'szt6zdnb', // Replace with your actual project ID
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true, // Use CDN for faster reads; set to false if you need fresh data
});

export async function GET() {
  try {
    // Query to fetch all blog posts with their author populated
    const query = `*[_type == "blogPost"]{
      _id,
      title,
      description,
      productLinks,
      price,
      "authorName": author->name,
      "authorEmail": author->email,
      createdAt,
      updatedAt
    }`;

    const posts = await client.fetch(query);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}