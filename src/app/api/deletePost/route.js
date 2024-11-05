// src/app/api/deletePost/route.js
import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: 'szt6zdnb',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Ensure this token has delete permissions in Sanity
});

export async function DELETE(request) {
  // Parse URL to get the query parameters
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Extract the 'id' parameter

  // Check if 'id' parameter is provided
  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    // Delete the document with the specified 'id' in Sanity
    const result = await client.delete(id);
    console.log("Delete result:", result); // For debugging

    // Return a success message
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    // Log and return an error message
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}
