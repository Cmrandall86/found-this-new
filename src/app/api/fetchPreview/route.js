import { NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";

// Helper function for timeout
const withTimeout = (promise, timeout = 5000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    console.warn("API called without a URL");
    return NextResponse.json(
      { error: "No URL provided" },
      { status: 400 }
    );
  }

  try {
    // Fetch link preview data with a timeout
    const previewData = await withTimeout(getLinkPreview(url), 5000);

    // Filter and prioritize high-quality Amazon product images
    const productImages = (previewData.images || [])
      .filter((img) => img.includes("_AC_") || img.includes("_SX")) // Ensure only Amazon-style product images
      .map((img) =>
        img
          .replace(/(_AC_.*?_)/, "_AC_SL500_") // Replace Amazon's size/quality pattern
          .replace(/(_SX\d+_)/, "_SL500_") // Replace `_SX` patterns with `_SL500_`
      )
      .slice(0, 4); // Limit to 4 images

    console.log("Processed Images:", productImages);

    return NextResponse.json({
      title: previewData.title || "No title available",
      description: previewData.description || "No description available",
      images:
        productImages.length > 0
          ? productImages
          : ["https://via.placeholder.com/300x200?text=No+Image"], // Fallback image
    });
  } catch (error) {
    console.error("Error fetching preview data:", error.message);
    const status = error.message === "Request timeout" ? 408 : 500;

    return NextResponse.json(
      {
        error: "Failed to fetch preview",
        title: "No Preview Available",
        description: "Unable to fetch preview data.",
        images: ["https://via.placeholder.com/300x200?text=No+Image"], // Fallback image
      },
      { status }
    );
  }
}
