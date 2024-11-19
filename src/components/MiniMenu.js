// src/components/MiniMenu.js
import React, { useRef, useEffect } from "react";
import "../../styles/minimenu.css";

export default function MiniMenu({ onDelete, onEdit, onClose }) {
  const menuRef = useRef(null);

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="mini-menu" ref={menuRef}>
      <button onClick={onClose} className="close-button">
        X
      </button>
      <button
        className="menu-action delete-action"
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this item?")) {
            onDelete();
            onClose(); // Close the menu after deleting
          }
        }}
      >
        Delete
      </button>
      <button
        className="menu-action edit-action"
        onClick={() => {
          onEdit(); // Perform the edit action
          onClose(); // Close the menu after clicking Edit
        }}
      >
        Edit
      </button>
    </div>
  );
}
