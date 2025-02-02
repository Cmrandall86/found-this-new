// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Create the post document with schema validation
    const newPost = await client.create({
      _type: "blogPost",
      title: data.title,
      description: data.description || "",
      productURL: data.productURL,
      price: Number(data.price), // Ensure it's a number, not a string
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(data.tags) ? [...new Set(data.tags)].filter(tag => tag.trim()) : [] // Ensure unique tags
    });

    return NextResponse.json(newPost, { 
      headers: { 'Cache-Control': 'no-cache' } 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      error: 'Error creating post',
      details: error.message 
    }, { status: 500 });
  }
}
