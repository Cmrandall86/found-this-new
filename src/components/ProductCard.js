// src/components/ProductCard.js
import React from "react";
import MiniMenu from "@/components/MiniMenu";
// import "@/styles/productcard.css";
import '../../styles/productcard.css'

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
}) {
  return (
    <div className="product-card">
      <button className="menu-button" onClick={toggleMenu}>
        ⋮
      </button>
      {isMenuOpen && (
        <MiniMenu
          onClose={toggleMenu}
          onDelete={onDelete}
          onEdit={onEdit}
          ref={menuRef}
        />
      )}

      <h3 className="product-card-title">{title}</h3>

      {previewData?.images && (
        <div className="preview-thumbnails">
          {previewData.images.slice(0, 4).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Preview ${index + 1}`}
              className="preview-thumbnail"
            />
          ))}
        </div>
      )}

      <p className="product-card-price">{price ? `$${price}` : "N/A"}</p>

      {productURL && (
        <a href={productURL} target="_blank" rel="noopener noreferrer" className="product-card-link">
          View Product
        </a>
      )}
    </div>
  );
}
