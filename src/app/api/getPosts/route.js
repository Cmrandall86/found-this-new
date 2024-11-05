// src/app/api/getPosts/route.js
import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: 'szt6zdnb',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
});

export async function GET() {
  try {
    const query = `*[_type == "blogPost"]{
      _id,
      title,
      description,
      productURL,       // Updated field name
      price,
      "authorName": author->name,
      "authorEmail": author->email,
      createdAt,
      updatedAt
    }`;

    const posts = await client.fetch(query);
    console.log('Fetched posts from Sanity:', posts);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}
