// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    const newPost = await client.create({
      _type: 'blogPost',
      title: data.title,
      description: data.description,
      productURL: data.productURL,
      price: data.price,
      author: { _type: "reference", _ref: data.authorId },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(newPost, { headers: { 'Cache-Control': 'no-cache' } });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}
