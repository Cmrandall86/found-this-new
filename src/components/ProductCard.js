import React, { useState, useEffect, useRef } from "react";
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
  const imageRef = useRef(null);
  const mountedRef = useRef(true);

  // Handle image loading
  useEffect(() => {
    const imageUrl = mainImage || (previewData?.images?.[0] || null);
    if (!imageUrl) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    // Create new image instance
    const img = new Image();
    
    img.onload = () => {
      if (mountedRef.current) {
        setIsLoading(false);
        setHasError(false);
        if (imageRef.current) {
          imageRef.current.src = imageUrl;
        }
      }
    };

    img.onerror = () => {
      if (mountedRef.current) {
        console.error(`Failed to load image for ${title}`);
        setIsLoading(false);
        setHasError(true);
      }
    };

    // Start loading
    setIsLoading(true);
    setHasError(false);
    img.src = imageUrl;

    // Cleanup
    return () => {
      mountedRef.current = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [mainImage, previewData, title]);

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
        
        {hasError ? (
          <div className="placeholder-container">
            <FaImage className="placeholder-icon" />
            <span>No Image Available</span>
          </div>
        ) : (
          <div className="image-with-description">
            <img
              ref={imageRef}
              alt={title || "Product image"}
              className={`preview-thumbnail ${!isLoading ? 'loaded' : ''}`}
              onClick={toggleDescription}
              style={{ 
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
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
