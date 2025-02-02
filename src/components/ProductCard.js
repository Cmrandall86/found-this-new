import React, { useState, useEffect } from "react";
import MiniMenu from "@/components/MiniMenu";
import "../../styles/productcard.css";
import { FaImage } from 'react-icons/fa';

export default function ProductCard({
  title,
  description,
  productURL,
  price,
  previewData,
  isMenuOpen,
  toggleMenu,
  onDelete,
  onEdit,
  menuRef,
  tags,
  mainImage,
  postId,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // Determine which image to use
  const imageUrl = React.useMemo(() => {
    if (mainImage) {
      return mainImage; // Already processed by getOptimizedImageUrl
    }
    if (previewData?.images?.[0]) {
      const previewUrl = previewData.images[0];
      // Add postId to preview images as well
      return `${previewUrl}${previewUrl.includes('?') ? '&' : '?'}cacheBuster=${postId}-${Date.now()}`;
    }
    return null;
  }, [mainImage, previewData, postId]);

  // Force image reload when URL changes
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      setIsLoading(true);
      setHasError(false);
      
      img.onload = () => {
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error(`Image failed to load for ${title}:`, imageUrl);
    setHasError(true);
    setIsLoading(false);
  };

  const toggleDescription = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDescription(!showDescription);
  };

  return (
    <div className="product-card">
      <div className="menu-button-container">
        <button className="menu-button" onClick={toggleMenu}>
          ⋮
        </button>
        {isMenuOpen && (
          <MiniMenu onClose={toggleMenu} onDelete={onDelete} onEdit={onEdit} ref={menuRef} />
        )}
      </div>

      <div className="image-container">
        {isLoading && (
          <div className="loading-animation">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {!imageUrl || hasError ? (
          <div className="placeholder-container">
            <FaImage className="placeholder-icon" />
            <span>No Image Available</span>
          </div>
        ) : (
          <div className="image-with-description">
            <img
              src={imageUrl}
              alt={title || "Product image"}
              className={`preview-thumbnail ${!isLoading ? 'loaded' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={toggleDescription}
              style={{ display: isLoading ? 'none' : 'block' }}
              key={imageUrl} // Add key to force re-render when URL changes
            />
            {showDescription && (
              <div className="image-description-overlay">
                <button className="close-description" onClick={toggleDescription}>×</button>
                <p>{description || previewData?.description || "No description available"}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <h3 className="product-card-title">{title}</h3>
      <p className="product-card-price">{price ? `$${price}` : "N/A"}</p>
      {tags?.filter((tag) => tag.trim() !== "").length > 0 && (
        <div className="product-card-tags">
          {tags
            .filter((tag) => tag.trim() !== "")
            .map((tag, index) => (
              <span key={index} className="product-card-tag">
                {tag}
              </span>
            ))}
        </div>
      )}
      {productURL && (
        <a href={productURL} target="_blank" rel="noopener noreferrer" className="product-card-link">
          View Product
        </a>
      )}
    </div>
  );
}
