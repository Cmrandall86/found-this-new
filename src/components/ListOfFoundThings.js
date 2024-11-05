import React, { useState, useEffect } from "react";

export default function ListOfFoundThings({ items, onDelete }) {
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    const fetchPreviews = async () => {
      const previewsData = {};
      for (const item of items) {
        if (item.productURL && !previews[item._id]) {
          try {
            const response = await fetch(`/api/getUrlPreview?url=${encodeURIComponent(item.productURL)}`);
            const data = await response.json();
            previewsData[item._id] = data || {}; // Ensure at least an empty object if no data
          } catch (error) {
            console.error("Error fetching preview:", error);
          }
        }
      }
      setPreviews((prev) => ({ ...prev, ...previewsData }));
    };

    if (items.length > 0) {
      fetchPreviews();
    }
  }, [items]);

  return (
    <ul className="found-things-list">
      {items.map((item) => (
        <li key={item._id} className="found-thing-item">
          <h2>{item.title}</h2>
          <p><strong>Description:</strong> {item.description}</p>

          {item.productURL && (
            <div className="url-preview">
              <a href={item.productURL} target="_blank" rel="noopener noreferrer">
                {previews[item._id] && previews[item._id].image ? (
                  <img src={previews[item._id].image} alt="Product Preview" />
                ) : (
                  <p>Click here to view product</p>
                )}
              </a>
              {previews[item._id] && previews[item._id].title && (
                <p>{previews[item._id].title}</p>
              )}
            </div>
          )}

          {item.price && <p><strong>Price:</strong> ${item.price}</p>}
          
          <button onClick={() => onDelete(item._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
