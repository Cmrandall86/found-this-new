// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.productURL || typeof data.price !== 'number') {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create post document matching the schema exactly
    const newPost = await client.create({
      _type: "blogPost",
      title: data.title.trim(),
      description: (data.description || '').trim(),
      productURL: data.productURL.trim(),
      price: Number(data.price),
      imageUrl: (data.imageUrl || '').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(data.tags) ? 
        data.tags
          .filter(tag => typeof tag === 'string' && tag.trim() !== '')
          .map(tag => tag.trim())
        : []
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      error: 'Error creating post',
      details: error.message 
    }, { status: 500 });
  }
}
