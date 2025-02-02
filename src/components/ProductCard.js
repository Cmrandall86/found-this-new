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
  postId,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const imageRef = useRef(null);
  const mountedRef = useRef(true);

  // Effect to handle preview image URL
  useEffect(() => {
    const url = previewData?.images?.[0] || null;
    setImageUrl(url);
  }, [previewData]);

  // Effect to handle image loading
  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    img.onload = () => {
      if (mountedRef.current) {
        if (imageRef.current) {
          imageRef.current.src = imageUrl;
        }
        setIsLoading(false);
        setHasError(false);
      }
    };

    img.onerror = () => {
      if (mountedRef.current) {
        setIsLoading(false);
        setHasError(true);
      }
    };

    img.src = imageUrl;

    return () => {
      mountedRef.current = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

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
