// src/app/api/createPost/route.js
import client from '../../../../lib/sanityClient'; 
import { NextResponse } from 'next/server';
import { getLinkPreview } from "link-preview-js";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Creating post with data:', data);

    const preview = await getLinkPreview(data.productURL, {
      timeout: 10000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1'
      },
      followRedirects: 'follow'
    });

    // Get Amazon media images
    const amazonImages = preview.images.filter(img => 
      img.includes('m.media-amazon.com/images/I/') &&
      !img.includes('sprite') &&
      !img.includes('button')
    );

    console.log('All Amazon images:', amazonImages);

    // Look for the thumbnail image first (it's usually the main product image)
    const thumbnailImage = amazonImages.find(img => img.includes('_SX38_SY50_CR'));
    
    // Convert thumbnail URL to high-res version
    const previewImage = thumbnailImage ? 
      thumbnailImage.replace(
        '_SX38_SY50_CR,0,0,38,50_',
        '_SX300_SY400_CR,0,0,300,400_'  // Using slightly smaller dimensions for product cards
      ) : 
      // Fallback to previous logic if no thumbnail found
      amazonImages.find(img => 
        !img.includes('sprite') && 
        !img.includes('button') &&
        !img.includes('_SR100,100_')
      );

    console.log('Selected preview image:', previewImage);

    const postData = {
      _type: "blogPost",
      title: data.title,
      description: data.description || "",
      productURL: data.productURL,
      price: Number(data.price),
      previewImage: previewImage || "",
      previewTitle: preview.title || '',
      previewDescription: preview.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(data.tags) ? [...new Set(data.tags)].filter(tag => tag.trim()) : []
    };

    console.log('Sending to Sanity:', postData);

    const newPost = await client.create(postData);
    console.log('Response from Sanity:', newPost);

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      error: 'Error creating post',
      details: error.message 
    }, { status: 500 });
  }
}
