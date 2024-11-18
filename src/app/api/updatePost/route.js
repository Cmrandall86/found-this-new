// src/app/api/updatePost/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  const { id, title, description, productURL, price, tags, updatedAt } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    await client
      .patch(id) // Document ID to patch
      .set({
        title,
        description,
        productURL,
        price,
        tags: tags || [], // Update tags
        updatedAt, // Update the `updatedAt` timestamp
      })
      .commit();

    const updatedPost = await client.getDocument(id);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
