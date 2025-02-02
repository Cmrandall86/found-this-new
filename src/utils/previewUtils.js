import { load } from 'cheerio';

export async function fetchPreviewUrls(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);

    // Get the first product image or og:image
    const productImage = 
      $('img[data-old-hires]').first().attr('data-old-hires') ||
      $('img[data-a-dynamic-image]').first().attr('src') ||
      $('meta[property="og:image"]').attr('content') ||
      $('img[id="landingImage"]').attr('src');

    return {
      title: $('meta[property="og:title"]').attr('content') || $('title').text() || '',
      description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '',
      images: productImage ? [productImage] : []
    };
  } catch (error) {
    console.error('Error fetching preview:', error);
    return {
      title: 'Preview Unavailable',
      description: 'Unable to load preview data',
      images: []
    };
  }
} 