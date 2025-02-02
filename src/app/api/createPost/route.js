// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Create the post document using the current schema
    const newPost = await client.create({
      _type: "blogPost",
      title: data.title,
      description: data.description || "",
      productURL: data.productURL || "",
      price: Number(data.price) || 0,
      imageUrl: data.imageUrl || "", // Use imageUrl instead of mainImage
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(data.tags) ? data.tags : []
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
