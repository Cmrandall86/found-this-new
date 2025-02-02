import { NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const previewData = await getLinkPreview(url, {
      timeout: 10000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      followRedirects: 'follow'
    });

    // Get all Amazon media images
    const amazonImages = previewData.images.filter(img => 
      img.includes('m.media-amazon.com/images/I/')
    );

    console.log('All Amazon images:', amazonImages);

    // Explicitly reject small thumbnails first
    if (amazonImages.every(img => img.includes('_SX38_SY50_'))) {
      console.log('Only found small thumbnails, retrying...');
      return NextResponse.json({
        title: previewData.title,
        description: previewData.description,
        images: []
      });
    }

    // Look for images in order of preference
    const bestImage = 
      // First priority: AC_SY300 format
      amazonImages.find(img => img.includes('_AC_SY300_SX300_')) ||
      // Second priority: UF480 format
      amazonImages.find(img => img.includes('_AC_UF480,480_SR480,480_')) ||
      // Third priority: SY445 with QL70
      amazonImages.find(img => img.includes('_SY445_') && img.includes('_QL70_')) ||
      // Fourth priority: Any non-thumbnail image
      amazonImages.find(img => 
        !img.includes('_SX38_SY50_') && 
        !img.includes('sprite') && 
        !img.includes('button') &&
        !img.includes('_SY88') &&
        !img.includes('_SR100,100_')
      );

    if (bestImage) {
      console.log('Selected best image:', bestImage);
      // Cache control to prevent stale responses
      return NextResponse.json({
        title: previewData.title,
        description: previewData.description,
        images: [bestImage]
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    }

    return NextResponse.json({
      title: previewData.title,
      description: previewData.description,
      images: []
    });

  } catch (error) {
    console.error("Error fetching preview data:", error);
    return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
  }
}
