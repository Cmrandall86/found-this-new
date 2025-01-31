import React, { useState, useEffect } from "react";
import MiniMenu from "@/components/MiniMenu";
import "../../styles/productcard.css";
import { FaImage } from 'react-icons/fa';

export default function ProductCard({
  title,
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

  useEffect(() => {
    setImageState("loading");

    if (mainImage) {
      setImageSrc(mainImage);
    } else if (previewData?.images?.[0]) {
      setImageSrc(previewData.images[0]);
    } else {
      setImageState("no-image");
    }
  }, [mainImage, previewData]);

  const handleImageLoad = () => {
    setImageState("loaded");
  };

  const handleImageError = () => {
    setImageState("no-image");
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
          <img
            src={imageSrc}
            alt={title || "Product image"}
            className="preview-thumbnail loaded"
            onError={handleImageError}
            loading="lazy"
          />
        );
      
      default:
        return null;
    }
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
