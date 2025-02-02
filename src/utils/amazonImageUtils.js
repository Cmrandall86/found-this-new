// Helper function to get the best Amazon product image
export const getBestAmazonImage = (images) => {
  if (!images?.length) {
    console.log('No images provided');
    return null;
  }

  console.log('All received images:', images);

  // Look for the AC_SR150,300 format first (best format)
  const srImage = images.find(url => 
    url.includes('.__AC_SR150,300___')
  );

  if (srImage) {
    console.log('Found SR image:', srImage);
    return srImage;
  }

  // If no SR image found, return the first image (should already be filtered by fetchPreview)
  return images[0] || null;
}; 