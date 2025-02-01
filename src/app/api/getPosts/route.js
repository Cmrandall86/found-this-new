// src/app/api/getPosts/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Enhanced query to include more image metadata
    const query = `*[_type == "blogPost"] | order(createdAt desc) {
      _id,
      title,
      description,
      productURL,
      price,
      tags,
      "createdAt": coalesce(createdAt, _createdAt),
      "updatedAt": coalesce(updatedAt, _updatedAt),
      mainImage {
        asset-> {
          _id,
          url,
          metadata
        }
      }
    }`;

    const posts = await client.fetch(query);
    
    if (!posts) {
      console.error('No posts returned from Sanity');
      return NextResponse.json({ error: 'No posts found' }, { status: 404 });
    }

    const transformedPosts = posts.map(post => ({
      ...post,
      price: typeof post.price === 'number' ? post.price : 0,
      tags: Array.isArray(post.tags) ? post.tags : [],
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || new Date().toISOString(),
      mainImage: post.mainImage ? {
        ...post.mainImage,
        asset: {
          ...post.mainImage.asset,
          _type: 'sanity.imageAsset'
        }
      } : null
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return more specific error information
    return NextResponse.json(
      { 
        error: 'Error fetching posts',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
