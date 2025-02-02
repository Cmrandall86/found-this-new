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
    const getImageUrl = () => {
      // Check previewData first since that seems to have working URLs
      if (previewData?.images?.length > 0) {
        return previewData.images[0];
      }
      // Then try the Sanity imageUrl
      if (mainImage && mainImage !== '') {
        return mainImage;
      }
      return null;
    };

    const imageUrl = getImageUrl();
    console.log('Final image URL:', imageUrl); // Debug log

    if (!imageUrl) {
      setIsLoading(false);
      setHasError(true);
      if (imageRef.current) {
        imageRef.current.removeAttribute('src');
      }
      return;
    }

    const img = new Image();
    let mounted = true;

    img.onload = () => {
      if (mounted && imageRef.current) {
        console.log('Image loaded successfully:', imageUrl);
        imageRef.current.src = imageUrl;
        imageRef.current.style.opacity = '1';
        setIsLoading(false);
        setHasError(false);
      }
    };

    img.onerror = () => {
      if (mounted) {
        console.error('Image failed to load:', {
          url: imageUrl,
          title,
        });
        setIsLoading(false);
        setHasError(true);
        if (imageRef.current) {
          imageRef.current.removeAttribute('src');
        }
      }
    };

    setIsLoading(true);
    setHasError(false);
    img.src = imageUrl;

    return () => {
      mounted = false;
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
        
        <div className="image-with-description">
          {hasError ? (
            <div className="placeholder-container">
              <FaImage className="placeholder-icon" />
              <span>No Image Available</span>
            </div>
          ) : (
            <img
              ref={imageRef}
              alt={title || "Product image"}
              className="preview-thumbnail"
              onClick={toggleDescription}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          )}
          {showDescription && (
            <div className="image-description-overlay">
              <button className="close-description" onClick={toggleDescription}>×</button>
              <p>{description || previewData?.description || "No description available"}</p>
            </div>
          )}
        </div>
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
