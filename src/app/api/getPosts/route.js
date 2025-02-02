// src/app/api/getPosts/route.js
import { NextResponse } from 'next/server';
import client from '../../../../lib/sanityClient';

export async function GET() {
  try {
    // Query all blog posts, ordered by createdAt date
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

    const posts = await client.fetch(query);
    
    console.log('Fetched posts:', posts);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    );
  }
}
