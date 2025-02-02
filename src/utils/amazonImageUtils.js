// Helper function to get the best Amazon product image
export const getBestAmazonImage = (images) => {
  if (!images?.length) return null;

  const productImages = images.filter(url => {
    const urlString = String(url);
    return (
      (urlString.includes('m.media-amazon.com/images/') || 
       urlString.includes('images-na.ssl-images-amazon.com/images/')) &&
      urlString.includes('/I/') &&
      !urlString.includes('fls-na.amazon.com') &&
      !urlString.includes('uedata') &&
      !urlString.includes('batch/1/op') &&
      !urlString.includes('grey-pixel') &&
      !urlString.includes('transparent-pixel')
    );
  });

  if (!productImages.length) return null;

  const mainImage = productImages.find(url => {
    const urlString = String(url);
    return urlString.includes('_AC_') && urlString.includes('_QL70_');
  });

  return mainImage || productImages[0];
}; 