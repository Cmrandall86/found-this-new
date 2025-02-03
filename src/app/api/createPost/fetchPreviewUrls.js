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
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Extract preview image URL
    let previewImage = '';
    const imageMatches = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
                        html.match(/<meta\s+name="og:image"\s+content="([^"]+)"/i);

    if (imageMatches && imageMatches[1]) {
      const potentialImage = imageMatches[1];
      
      // Filter out small images and ensure it's a product image
      if (isValidProductImage(potentialImage)) {
        previewImage = potentialImage;
      } else {
        // Try to find a valid product image in the HTML
        const productImageMatches = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9-]+\._.*?\.jpg/g);
        if (productImageMatches) {
          // Find the first valid product image
          previewImage = productImageMatches.find(img => isValidProductImage(img)) || '';
        }
      }
    }

    // Extract preview title and description as before...
    const titleMatches = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                        html.match(/<meta\s+name="og:title"\s+content="([^"]+)"/i) ||
                        html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const previewTitle = titleMatches ? titleMatches[1] : '';

    const descMatches = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                       html.match(/<meta\s+name="og:description"\s+content="([^"]+)"/i) ||
                       html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const previewDescription = descMatches ? descMatches[1] : '';

    return {
      previewImage,
      previewTitle,
      previewDescription
    };
  } catch (error) {
    console.error('Error fetching preview URLs:', error);
    return {
      previewImage: '',
      previewTitle: '',
      previewDescription: ''
    };
  }
}

// Helper function to validate product images
function isValidProductImage(url) {
  if (!url) return false;

  // Must be an Amazon media URL
  if (!url.includes('m.media-amazon.com/images/I/')) return false;

  // Extract the image ID portion (e.g., "21hOCmsvPQL" from the URL)
  const imageIdMatch = url.match(/\/I\/([A-Za-z0-9]+)/);
  if (!imageIdMatch) return false;
  
  const imageId = imageIdMatch[1];
  
  // Filter criteria:
  // 1. Image ID should be longer than 10 chars (filters out small images like "21hOCmsvPQL")
  // 2. Should contain product image indicators
  const isLongEnough = imageId.length > 10;
  const hasProductIndicators = url.includes('._AC_') || 
                              url.includes('._SX') || 
                              url.includes('._SY') ||
                              url.includes('._UX') ||
                              url.includes('._UY');

  return isLongEnough && hasProductIndicators;
}

export default fetchPreviewUrls;