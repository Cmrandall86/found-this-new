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

    // Check if URL is from Amazon using more robust check
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
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        }),
        5000
      );
  
      const productImages = (previewData.images || [])
        .filter((img) => img.includes("_AC_") || img.includes("_SX") || img.includes("images/I/"))
        .map((img) => {
          if (img.includes('_AC_')) {
            return img.replace(/(_AC_.*?_)/, '_AC_SL2000_')
                     .replace(/_\d+x\d+_/, '_2000x2000_')
                     .replace(/\._.*?_\./, '._FMjpg_.');
          }
          if (img.includes('_SX')) {
            return img.replace(/(_SX\d+_)/, '_SX2000_')
                     .replace(/\._.*?_\./, '._FMjpg_.');
          }
          if (img.includes('images/I/')) {
            const baseUrl = img.split('._')[0];
            return `${baseUrl}._AC_SL2000_FMjpg_.jpg`;
          }
          return img;
        })
        .filter((img, index, self) => 
          self.indexOf(img) === index && 
          !img.includes('_SL50_') && 
          !img.includes('_SX50_')
        )
        .slice(0, 4);
  
      return {
        title: previewData.title || "No title available",
        description: previewData.description || "No description available",
        images: productImages.length > 0 ? productImages : ["https://via.placeholder.com/300x200?text=No+Image"],
      };
      
    } catch (error) {
      return {
        title: "Error fetching preview",
        description: "Unable to fetch preview data",
        images: ["https://via.placeholder.com/300x200?text=Error+Loading+Preview"],
      };
    }
  }