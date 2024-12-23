import { getLinkPreview } from "link-preview-js";

const withTimeout = (promise, timeout = 5000) => // Shorter timeout: 5 seconds
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout)),
  ]);

export async function fetchPreviewUrls(url) {

    if (!url) {
      console.warn("API called without a URL");
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }
  
    try {
      console.log("Fetching preview for:", url);
  
      // Fetch link preview data with a custom User-Agent header
      const previewData = await withTimeout(
        getLinkPreview(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        }),
        5000 // Timeout reduced to 5 seconds
      );
  
      // Filter and prioritize lower-quality images (reduce size further)
      const productImages = (previewData.images || [])
        .filter((img) => img.includes("_AC_") || img.includes("_SX"))
        .map((img) =>
          img.replace(/(_AC_.*?_)/, "_AC_SL125_").replace(/(_SX\d+_)/, "_SX125_") // Lower quality: SL125/SX125
        )
        .slice(0, 4);
  
      const responseData = {
        title: previewData.title || "No title available",
        description: previewData.description || "No description available",
        images: productImages.length > 0 ? productImages : ["https://via.placeholder.com/300x200?text=No+Image"],
      };
  
      return responseData;
      
    } catch (error) {
      console.error(`Error fetching preview for URL during post creation ${url}:`, error.message);
  
      return {
        error: "Failed to fetch preview",
        url,
        reason: error.message,
        images: ["https://via.placeholder.com/300x200?text=No+Image"],
      };
    }
  }