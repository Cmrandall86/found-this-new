// src/app/api/deletePost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const result = await client.delete(id);
    console.log("Delete result:", result);
    return NextResponse.json({ message: "Post deleted successfully" }, { headers: { 'Cache-Control': 'no-cache' } });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}
