// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';
import { getLinkPreview } from "link-preview-js";
import { getBestAmazonImage } from "@/utils/amazonImageUtils";

export async function POST(request) {
  try {
    const data = await request.json();
    
    const preview = await getLinkPreview(data.productURL, {
      timeout: 10000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      followRedirects: 'follow'
    });

    const bestImage = getBestAmazonImage(preview.images);

    const newPost = await client.create({
      _type: "blogPost",
      title: data.title,
      description: data.description || "",
      productURL: data.productURL,
      price: Number(data.price),
      previewImage: bestImage || null,
      previewTitle: preview.title || '',
      previewDescription: preview.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(data.tags) ? [...new Set(data.tags)].filter(tag => tag.trim()) : []
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
