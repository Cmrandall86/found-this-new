// src/app/api/updatePost/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const { id, title, description, productURL, price, tags } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Update document with schema validation
    await client
      .patch(id)
      .set({
        title: title,
        description: description || "",
        productURL: productURL,
        price: Number(price), // Ensure it's a number, not a string
        tags: Array.isArray(tags) ? [...new Set(tags)].filter(tag => tag.trim()) : [], // Ensure unique tags
        updatedAt: new Date().toISOString()
      })
      .commit();

    const updatedPost = await client.getDocument(id);
    
    return NextResponse.json(updatedPost, {
      headers: { 'Cache-Control': 'no-cache' }
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ 
      error: 'Failed to update post',
      details: error.message 
    }, { status: 500 });
  }
}
