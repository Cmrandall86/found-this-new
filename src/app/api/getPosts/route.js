// src/app/api/getPosts/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Add explicit pagination with a high limit
    const query = `*[_type == "blogPost"] | order(createdAt desc) [0...100] {
      _id,
      title,
      description,
      productURL,
      price,
      imageUrl,
      createdAt,
      updatedAt,
      tags
    }`;

    const posts = await client.fetch(query);
    
    if (!Array.isArray(posts) || posts.length === 0) {
      console.warn('No posts found or invalid response from Sanity');
      return NextResponse.json([]);
    }

    // Transform and validate each post
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title || 'Untitled',
      description: post.description || '',
      productURL: post.productURL || '',
      price: typeof post.price === 'number' ? post.price : 0,
      imageUrl: post.imageUrl || '',
      tags: Array.isArray(post.tags) ? post.tags : [],
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || new Date().toISOString()
    }));

    return NextResponse.json(transformedPosts, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
