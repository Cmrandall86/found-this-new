// src/app/api/getPosts/route.js
import { NextResponse } from 'next/server';
import client from '../../../../lib/sanityClient';

export async function GET() {
  try {
    console.log('Sanity client config:', {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      apiVersion: client.config().apiVersion,
      useCdn: client.config().useCdn
    });

    // Query all blog posts, ordered by createdAt desc
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

    // Force fresh data from Sanity
    const posts = await client.fetch(query, {}, {
      cache: 'no-store',
      useCdn: false,
      perspective: 'published'
    });
    
    console.log('Raw posts from Sanity:', posts);

    // Transform posts to ensure data consistency
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title || '',
      description: post.description || '',
      productURL: post.productURL || '',
      price: typeof post.price === 'number' ? post.price : 0,
      previewImage: post.previewImage || '',
      previewTitle: post.previewTitle || '',
      previewDescription: post.previewDescription || '',
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || new Date().toISOString(),
      tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : []
    }));

    console.log('Transformed posts:', transformedPosts);

    return new NextResponse(JSON.stringify(transformedPosts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch posts', 
        details: error.message,
        config: client.config()
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
}
