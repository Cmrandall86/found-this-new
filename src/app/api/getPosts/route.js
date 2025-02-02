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

    // Fetch with no-cache option
    const posts = await client.fetch(query, {}, {
      cache: 'no-store'
    });
    
    console.log('Fetched posts:', posts);

    // Return with cache control headers
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
}
