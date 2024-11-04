import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: 'szt6zdnb', // Replace with your actual project ID
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Ensure this token has write permissions
});

export async function POST(req) {
  try {
    const newPost = await req.json();
    
    // Include additional fields like createdAt and updatedAt
    const postToCreate = {
      _type: 'blogPost',
      ...newPost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await client.create(postToCreate);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}


