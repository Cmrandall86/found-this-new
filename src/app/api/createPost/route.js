// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';
import { fetchPreviewUrls } from './fetchPreviewUrls';

export async function POST(request) {
  try {
    const data = await request.json();

    const imagePreviewData = await fetchPreviewUrls(data.productURL);
    const imageUrl = imagePreviewData?.images[0]

    const newPost = await client.create({
      _type: 'blogPost',
      title: data.title,
      description: data.description,
      productURL: data.productURL,
      price: data.price,
      tags: data.tags || [], // Add tags
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: imageUrl
    });

    return NextResponse.json(newPost, { headers: { 'Cache-Control': 'no-cache' } });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}
