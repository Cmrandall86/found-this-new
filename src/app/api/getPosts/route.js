// src/app/api/getPosts/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic query first to test connection
    const query = `*[_type == "blogPost"] | order(createdAt desc)`;

    const posts = await client.fetch(query).catch(err => {
      console.error('Sanity fetch error:', err);
      throw new Error(`Sanity fetch failed: ${err.message}`);
    });
    
    if (!posts) {
      console.error('No posts returned from Sanity');
      return NextResponse.json({ error: 'No posts found' }, { status: 404 });
    }

    // Transform posts after successful fetch
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title || 'Untitled',
      description: post.description || '',
      productURL: post.productURL || '',
      price: typeof post.price === 'number' ? post.price : 0,
      tags: Array.isArray(post.tags) ? post.tags : [],
      createdAt: post.createdAt || post._createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || post._updatedAt || new Date().toISOString(),
      mainImage: post.mainImage || null
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
