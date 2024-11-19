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
    // Add timeout to the preview fetch request
    const previewData = await withTimeout(getLinkPreview(url), 5000);

    const productImages = previewData.images
      .filter((img) => img.includes("_AC_") || img.includes("_SX"))
      .map((img) =>
        img.replace(/(_AC_.*?_)/, "_AC_SL500_").replace(/(_SX\\d+_)/, "_SL500_")
      )
      .slice(0, 4);

    return NextResponse.json({
      title: previewData.title || "No title available",
      description: previewData.description || "No description available",
      images:
        productImages.length > 0
          ? productImages
          : ["https://via.placeholder.com/300x200?text=No+Image"],
    });
  } catch (error) {
    console.error("Error fetching preview data:", error.message);
    const status = error.message === "Request timeout" ? 408 : 500;

    return NextResponse.json(
      {
        error: "Failed to fetch preview",
        title: "No Preview Available",
        description: "Unable to fetch preview data.",
        images: ["https://via.placeholder.com/300x200?text=No+Image"],
      },
      { status }
    );
  }
}
