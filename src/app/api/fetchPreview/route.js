import { NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";
import { getBestAmazonImage } from "@/utils/amazonImageUtils";

// Local cache to store API responses
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL provided" });
    }

    const preview = await getLinkPreview(url, {
      timeout: 10000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      followRedirects: 'follow'
    });

    const bestImage = getBestAmazonImage(preview.images);
    
    const previewData = {
      title: preview.title || '',
      description: preview.description || '',
      images: bestImage ? [bestImage] : []
    };

    return NextResponse.json(previewData);
  } catch (error) {
    console.error('Preview fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch preview',
      details: error.message
    }, { status: 500 });
  }
}
