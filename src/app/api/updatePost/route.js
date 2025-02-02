// src/app/api/updatePost/route.js
import client from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';
import { getLinkPreview } from "link-preview-js";
import { getBestAmazonImage } from "@/utils/amazonImageUtils";

export async function PUT(request) {
  try {
    const { id, title, description, productURL, price, tags } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const preview = await getLinkPreview(productURL, {
      timeout: 10000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      followRedirects: 'follow'
    });

    const bestImage = getBestAmazonImage(preview.images);

    await client
      .patch(id)
      .set({
        title: title,
        description: description || "",
        productURL: productURL,
        price: Number(price),
        previewImage: bestImage || null,
        previewTitle: preview.title || '',
        previewDescription: preview.description || '',
        tags: Array.isArray(tags) ? [...new Set(tags)].filter(tag => tag.trim()) : [],
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
