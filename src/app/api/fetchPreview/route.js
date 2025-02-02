import { NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";

// Local cache to store API responses
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Helper function to get the best image from array
const getBestImage = (images) => {
  if (!images || images.length === 0) {
    return "https://placehold.co/300x300/e6e6e6/666666?text=No+Image";
  }

  // For Amazon URLs, prefer larger product images
  const productImages = images.filter(url => {
    // Match Amazon product images and exclude small thumbnails
    return url.includes('images/I') && !url.includes('_SX38_') && !url.includes('_SY38_');
  });

  if (productImages.length > 0) {
    // Try to find a medium or large image
    const mediumImage = productImages.find(url => 
      url.includes('_SX300_') || 
      url.includes('_SY300_') ||
      url.includes('_SX400_') ||
      url.includes('_SY400_')
    );

    if (mediumImage) {
      return mediumImage;
    }

    // If no medium image found, take the first product image
    return productImages[0];
  }

  // Fallback to the first image if no product images found
  return images[0];
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({
        title: "No URL provided",
        description: "Please provide a valid URL",
        images: ["https://placehold.co/300x300/e6e6e6/666666?text=No+URL"]
      });
    }

    // Check cache first
    const cachedData = cache.get(url);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedData.data);
    }

    // Fetch preview data using link-preview-js
    const result = await getLinkPreview(url, {
      timeout: 10000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      followRedirects: 'follow'
    });

    const bestImage = getBestImage(result.images);

    const previewData = {
      title: result.title || '',
      description: result.description || '',
      images: bestImage ? [bestImage] : ["https://placehold.co/300x300/e6e6e6/666666?text=No+Image"]
    };

    // Store in cache
    cache.set(url, {
      timestamp: Date.now(),
      data: previewData
    });

    return NextResponse.json(previewData);
  } catch (error) {
    console.error('Preview fetch error:', error);
    return NextResponse.json({
      title: "Error fetching preview",
      description: "Unable to fetch preview data",
      images: ["https://placehold.co/300x300/e6e6e6/666666?text=Error"]
    });
  }
}
