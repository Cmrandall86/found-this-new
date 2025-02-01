// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Handle image upload first if present
    let mainImage = null;
    if (data.imageUrl || data.fileData) {
      try {
        const imageResponse = await fetch('/api/uploadImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: data.imageUrl,
            fileData: data.fileData,
            // Add quality settings
            options: {
              quality: 90, // Set quality (0-100)
              preserveExifData: true, // Preserve image metadata
              maxWidth: 2000, // Maximum width
              maxHeight: 2000, // Maximum height
              format: 'webp' // Use modern format
            }
          }),
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }

        mainImage = await imageResponse.json();
      } catch (imageError) {
        console.error('Error handling image:', imageError);
      }
    }

    const newPost = await client.create({
      _type: 'blogPost',
      title: data.title,
      description: data.description,
      productURL: data.productURL,
      price: data.price,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mainImage: mainImage || null,
      imageMetadata: mainImage ? {
        _type: 'imageMetadata',
        source: data.imageUrl ? 'url' : 'upload',
        uploadedAt: new Date().toISOString(),
        quality: 90, // Store the quality setting used
        format: 'webp' // Store the format used
      } : null
    });

    return NextResponse.json(newPost, { headers: { 'Cache-Control': 'no-cache' } });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      error: 'Error creating post',
      details: error.message 
    }, { status: 500 });
  }
}
