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

    // Get the current post to check if productURL changed
    const currentPost = await client.getDocument(id);
    
    // Only fetch new preview data if productURL changed
    let previewData = {};
    if (productURL && productURL !== currentPost.productURL) {
      console.log('Product URL changed, fetching new preview data');
      const preview = await getLinkPreview(productURL, {
        timeout: 15000,
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

      // Get preview image
      const previewImage = preview.images?.find(img => {
        const urlString = String(img).toLowerCase();
        return urlString.includes('m.media-amazon.com/images/i/') && 
               !urlString.includes('sprite') &&
               !urlString.includes('captcha');
      });

      previewData = {
        previewImage: previewImage || currentPost.previewImage, // Fallback to current image
        previewTitle: preview.title || '',
        previewDescription: preview.description || ''
      };
    }

    // Update the post
    await client
      .patch(id)
      .set({
        title: title,
        description: description || "",
        productURL: productURL,
        price: Number(price),
        tags: Array.isArray(tags) ? [...new Set(tags)].filter(tag => tag.trim()) : [],
        updatedAt: new Date().toISOString(),
        ...previewData // Only include preview data if URL changed
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
