// src/app/api/fetchPreview/route.js
import { NextResponse } from 'next/server';
import { getLinkPreview } from 'link-preview-js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const previewData = await getLinkPreview(url);

    // Filter images to include only those with "_AC_" or "_SX" (common Amazon product image patterns)
    const productImages = previewData.images.filter(img => img.includes('_AC_') || img.includes('_SX')).slice(0, 4);

    return NextResponse.json({
      title: previewData.title,
      description: previewData.description,
      images: productImages, // Send up to 4 images
    });
  } catch (error) {
    console.error("Error fetching preview data:", error);
    return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
  }
}
