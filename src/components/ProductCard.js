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
}) {
  const [imageState, setImageState] = useState("loading"); // "loading", "loaded", "no-image"
  const [imageSrc, setImageSrc] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(mainImage);

  useEffect(() => {
    setImageState("loading");
    
    // First try to use the Sanity image
    if (mainImage) {
      setImageUrl(mainImage);
      setImageError(false);
    }
    // If no Sanity image, try to use preview image
    else if (previewData?.images?.[0]) {
      setImageUrl(previewData.images[0]);
      setImageError(false);
    }
    // If neither exists, show placeholder
    else {
      setImageState("no-image");
      setImageUrl("https://via.placeholder.com/300x200?text=No+Image");
      setImageError(true);
    }
  }, [mainImage, previewData]);

  useEffect(() => {
    console.log('Product Card Image:', {
      title,
      mainImage,
      previewData
    });
  }, [title, mainImage, previewData]);

  const handleImageLoad = () => {
    setImageState("loaded");
  };

  const handleImageError = () => {
    console.error(`Image failed to load for ${title}:`, imageUrl);
    setImageError(true);
    setImageUrl(previewData?.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image");
  };

  const toggleDescription = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDescription(!showDescription);
  };

  const handleModalClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDescription(false);
  };

  const renderImageContent = () => {
    switch (imageState) {
      case "loading":
        return (
          <div className="loading-animation">
            <div className="loading-spinner"></div>
            <span>Loading image...</span>
          </div>
        );
      
      case "no-image":
        return (
          <div className="placeholder-container">
            <FaImage className="placeholder-icon" />
            <span>No Image Available</span>
          </div>
        );
      
      case "loaded":
        return (
          <div className="image-with-description">
            <img
              src={!imageError ? imageUrl : "https://via.placeholder.com/300x200?text=No+Image"}
              alt={title || "Product image"}
              className="preview-thumbnail loaded"
              onError={handleImageError}
              loading="lazy"
              onClick={toggleDescription}
            />
            {showDescription && (
              <div className="image-description-overlay">
                <button className="close-description" onClick={toggleDescription}>×</button>
                <p>{description || previewData?.description || "No description available"}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const displayImage = mainImage || (previewData?.images?.[0]) || "https://via.placeholder.com/300x200?text=No+Image";

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
        {imageSrc && imageState === "loading" && (
          <img
            src={imageSrc}
            alt={title || "Product image"}
            className="preview-thumbnail"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: 'none' }}
          />
        )}
        {renderImageContent()}
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
