import React, { useState, useEffect } from "react";
import MiniMenu from "@/components/MiniMenu";
import "../../styles/productcard.css";

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
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  // Update imageSrc whenever previewData changes
  useEffect(() => {
    if (previewData?.images?.[0]) {
      setImageSrc(previewData.images[0]); // Use the provided image
    } else {
      setImageSrc(""); // Leave blank to trigger loading animation
    }
  }, [previewData]);

  const handleImageLoad = () => {
    setIsImageLoaded(true); // Mark as loaded to remove loading animation
  };

  const handleImageError = () => {
    setImageSrc("https://via.placeholder.com/300x200?text=No+Image"); // Fallback to placeholder
    setIsImageLoaded(true); // Stop loading animation
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
        {/* Show loading animation until image loads or falls back to placeholder */}
        {!isImageLoaded && <div className="image-placeholder">Loading...</div>}
        {imageSrc && (
          <img
            src={imageSrc}
            alt={previewData?.description || "Product image"}
            className={`preview-thumbnail ${isImageLoaded ? "loaded" : ""}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
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
