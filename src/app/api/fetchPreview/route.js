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

    // Filter images and adjust URLs for higher-quality images
    const productImages = previewData.images
      .filter(img => img.includes('_AC_') || img.includes('_SX'))
      .map(img => 
        img.replace(/(_AC_.*?_)/, '_AC_SL500_') // Replace Amazon's size/quality pattern
           .replace(/(_SX\d+_)/, '_SL500_')   // Replace with a larger size
      )
      .slice(0, 4); // Limit to 4 images

    return NextResponse.json({
      title: previewData.title,
      description: previewData.description,
      images: productImages, // Send up to 4 higher-quality images
    });
  } catch (error) {
    console.error("Error fetching preview data:", error);
    return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
  }
}
