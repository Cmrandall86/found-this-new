import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: 'szt6zdnb',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Ensure this token is set in .env.local
});

export async function POST(req) {
  try {
    const newPost = await req.json();
    const createdPost = await client.create({
      _type: 'blogPost',
      ...newPost,
    });
    return NextResponse.json(createdPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
