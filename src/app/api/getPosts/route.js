// src/app/api/getPosts/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Update query to include preview fields
    const query = `*[_type == "blogPost"] | order(createdAt desc) {
      _id,
      title,
      description,
      productURL,
      price,
      tags,
      createdAt,
      updatedAt,
      previewImage,
      previewTitle,
      previewDescription
    }`;

    const posts = await client.fetch(query, {}, {
      cache: 'no-cache',
      perspective: 'published'
    });

    if (!posts) {
      return NextResponse.json({ error: 'No posts found' }, { status: 404 });
    }

    // Transform posts to ensure data consistency
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title || 'Untitled',
      description: post.description || '',
      productURL: post.productURL || '',
      price: Number(post.price || 0),
      tags: Array.isArray(post.tags) ? [...new Set(post.tags)].filter(tag => tag.trim()) : [],
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || new Date().toISOString(),
      previewImage: post.previewImage || '',
      previewTitle: post.previewTitle || '',
      previewDescription: post.previewDescription || ''
    }));

    return NextResponse.json(transformedPosts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error in getPosts:', error);
    return NextResponse.json(
      { 
        error: 'Error fetching posts',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
