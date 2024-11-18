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
      <div className="menu-button-container">
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
      </div>
        {console.log(previewData)}
      <div className="image-container">
        <img
          src={previewData?.images[0]}
          alt={previewData?.description}
          className="preview-thumbnail"
        />
      </div>
      <h3 className="product-card-title">{title}</h3>
      <p className="product-card-price">{price ? `$${price}` : "N/A"}</p>

      {productURL && (
        <a
          href={productURL}
          target="_blank"
          rel="noopener noreferrer"
          className="product-card-link"
        >
          View Product
        </a>
      )}
    </div>
  );
}
