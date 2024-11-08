// src/app/api/updatePost/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  // Parse the JSON body and destructure fields
  const { id, title, description, productURL, price, updatedAt } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    // Patch the existing post with the updated fields
    await client
      .patch(id) // Document ID to patch
      .set({
        title,
        description,
        productURL,
        price,
        updatedAt, // Update the `updatedAt` timestamp
      })
      .commit(); // Perform the update

    // Fetch the updated post to return as a response
    const updatedPost = await client.getDocument(id);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
