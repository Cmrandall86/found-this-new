import { getLinkPreview } from "link-preview-js";

const withTimeout = (promise, timeout = 5000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout)),
  ]);

const isAmazonUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('amazon.com');
  } catch {
    return false;
  }
};

export async function fetchPreviewUrls(url) {
    if (!url) {
      return {
        title: "No URL provided",
        description: "Please provide a valid URL",
        images: ["https://via.placeholder.com/300x200?text=No+URL"],
      };
    }

    if (!isAmazonUrl(url)) {
      return {
        title: "Non-Amazon URL",
        description: "Only Amazon URLs are supported at this time",
        images: ["https://via.placeholder.com/300x200?text=Non+Amazon+URL"],
      };
    }
  
    try {
      const previewData = await withTimeout(
        getLinkPreview(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
          },
        }),
        5000
      );
  
      // More strict filtering for product images
      const productImages = (previewData.images || [])
        .filter(img => {
          // Only accept Amazon product images
          const isProductImage = 
            img.includes('/images/I/') && // Main product image path
            !img.includes('banner') &&    // Exclude banners
            !img.includes('advertisement') &&
            !img.includes('promotion') &&
            !img.includes('deal') &&
            img.includes('._'); // Amazon image format marker

          return isProductImage;
        })
        .map((img) => {
          // Extract the base image ID
          const baseUrl = img.split('._')[0];
          // Request high quality version
          return `${baseUrl}._AC_SL2000_FMjpg_.jpg`;
        })
        .filter((img, index, self) => 
          // Remove duplicates
          self.indexOf(img) === index
        )
        .slice(0, 4);

      // If no valid product images found, return placeholder
      if (productImages.length === 0) {
        return {
          title: previewData.title || "No title available",
          description: previewData.description || "No description available",
          images: ["https://via.placeholder.com/300x200?text=No+Product+Image"],
        };
      }

      return {
        title: previewData.title || "No title available",
        description: previewData.description || "No description available",
        images: productImages,
      };
      
    } catch (error) {
      return {
        title: "Error fetching preview",
        description: "Unable to fetch preview data",
        images: ["https://via.placeholder.com/300x200?text=Error+Loading+Preview"],
      };
    }
}