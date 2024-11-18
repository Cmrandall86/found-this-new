// src/app/api/getPosts/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = `*[_type == "blogPost"]{
      _id,
      title,
      description,
      productURL,
      price,
      tags, // Include tags in the response
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
