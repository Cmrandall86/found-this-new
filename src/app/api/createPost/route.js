// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title) {
      return NextResponse.json({ 
        error: 'Title is required' 
      }, { status: 400 });
    }

    // Create post document matching the schema exactly
    const newPost = await client.create({
      _type: "blogPost",
      title: data.title,
      description: data.description || "",
      productURL: data.productURL || "",
      price: typeof data.price === 'number' ? data.price : 0,
      imageUrl: data.imageUrl || "", // matches schema field name exactly
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(data.tags) ? 
        data.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '') : 
        []
    });

    // Return the created post
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      error: 'Error creating post',
      details: error.message 
    }, { status: 500 });
  }
}
