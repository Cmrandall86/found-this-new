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

// Helper function to transform Amazon image URLs
function transformAmazonImageUrl(url) {
  console.log('Transforming URL:', url);
  if (!url || !url.includes('m.media-amazon.com/images/I/')) return url;
  
  // First, extract the base image ID
  const baseImageMatch = url.match(/\/I\/([A-Za-z0-9]+)\./);
  if (!baseImageMatch) return url;
  
  // Construct a high-resolution URL using the base image ID
  const baseImageId = baseImageMatch[1];
  const transformedUrl = `https://m.media-amazon.com/images/I/${baseImageId}._AC_SL1500_.jpg`;
  console.log('Transformed to:', transformedUrl);
  return transformedUrl;
}

export async function fetchPreviewUrls(url) {
  try {
    console.log('Fetching preview for URL:', url);
    const response = await fetch(url);
    const html = await response.text();

    // Extract preview image URL
    let previewImage = '';
    const imageMatches = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
                        html.match(/<meta\s+name="og:image"\s+content="([^"]+)"/i);

    if (imageMatches && imageMatches[1]) {
      console.log('Found image in meta:', imageMatches[1]);
      previewImage = transformAmazonImageUrl(imageMatches[1]);
      console.log('After first transform:', previewImage);
    }

    // If no image found in meta tags, try to find in HTML for Amazon products
    if (!previewImage && isAmazonUrl(url)) {
      const productImageMatches = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9-]+\._[^"]+\.jpg/g);
      if (productImageMatches && productImageMatches.length > 0) {
        console.log('Found product image in HTML:', productImageMatches[0]);
        previewImage = transformAmazonImageUrl(productImageMatches[0]);
        console.log('After second transform:', previewImage);
      }
    }

    // One final check to ensure we have a high-res image
    if (previewImage && previewImage.includes('m.media-amazon.com/images/I/')) {
      previewImage = transformAmazonImageUrl(previewImage);
      console.log('Final image URL:', previewImage);
    }

    // Extract preview title and description
    const titleMatches = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                        html.match(/<meta\s+name="og:title"\s+content="([^"]+)"/i) ||
                        html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const previewTitle = titleMatches ? titleMatches[1] : '';

    const descMatches = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                       html.match(/<meta\s+name="og:description"\s+content="([^"]+)"/i) ||
                       html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const previewDescription = descMatches ? descMatches[1] : '';

    // Return all required properties
    const result = {
      previewImage: previewImage || '',
      previewTitle: previewTitle || '',
      previewDescription: previewDescription || '',
      images: previewImage ? [previewImage] : [],
      title: previewTitle || '',
      description: previewDescription || ''
    };

    console.log('Final result:', result);
    return result;

  } catch (error) {
    console.error('Error fetching preview URLs:', error);
    return {
      previewImage: '',
      previewTitle: '',
      previewDescription: '',
      images: [],
      title: '',
      description: ''
    };
  }
}

export default fetchPreviewUrls;