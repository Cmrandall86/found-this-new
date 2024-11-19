import React, { useState } from "react";
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

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="product-card">
      <div className="menu-button-container">
        <button className="menu-button" onClick={toggleMenu}>
          ⋮
        </button>
        {isMenuOpen && <MiniMenu onClose={toggleMenu} onDelete={onDelete} onEdit={onEdit} ref={menuRef} />}
      </div>
      <div className="image-container">
        {/* Show placeholder until image is loaded */}
        {!isImageLoaded && <div className="image-placeholder">Loading...</div>}
        <img
          src={previewData?.images[0]}
          alt={previewData?.description || "Product image"}
          className={`preview-thumbnail ${isImageLoaded ? "loaded" : ""}`}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
      <h3 className="product-card-title">{title}</h3>
      <p className="product-card-price">{price ? `$${price}` : "N/A"}</p>
      {/* Render tags only if tags exist and have valid values */}
      {tags?.filter((tag) => tag.trim() !== "").length > 0 && (
        <div className="product-card-tags">
          {tags
            .filter((tag) => tag.trim() !== "") // Remove empty tags
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
