import { NextResponse } from "next/server";
import { fetchPreviewUrls } from '../createPost/fetchPreviewUrls';

// Helper function for timeout
const withTimeout = (promise, timeout = 5000) => // Shorter timeout: 5 seconds
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout)),
  ]);

// Local cache to store API responses
const cache = new Map();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({
        title: "No URL provided",
        description: "Please provide a valid URL",
        images: ["https://via.placeholder.com/300x200?text=No+URL"]
      }, { status: 200 });
    }

    const previewData = await fetchPreviewUrls(url);
    
    // Always return a 200 status with our formatted response
    return NextResponse.json(previewData, { status: 200 });

  } catch (error) {
    // Return a 200 status with error information in the response
    return NextResponse.json({
      title: "Error fetching preview",
      description: "Unable to fetch preview data",
      images: ["https://via.placeholder.com/300x200?text=Error+Loading+Preview"]
    }, { status: 200 });
  }
}
