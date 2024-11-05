import React, { useState, useEffect } from "react";

export default function ListOfFoundThings({ items, onDelete }) {
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    const fetchPreviews = async () => {
      const previewsData = {};
      for (const item of items) {
        if (item.link && !previews[item._id]) {
          try {
            const response = await fetch(`/api/getUrlPreview?url=${encodeURIComponent(item.link)}`);
            const data = await response.json();
            previewsData[item._id] = data;
          } catch (error) {
            console.error("Error fetching preview:", error);
          }
        }
      }
      setPreviews((prev) => ({ ...prev, ...previewsData }));
    };

    fetchPreviews();
  }, [items]);

  return (
    <ul className="found-things-list">
      {items.map((item) => (
        <li key={item._id} className="found-thing-item">
          <h2>{item.title}</h2>
          <p><strong>Description:</strong> {item.description}</p>

          {item.link && (
            <div className="url-preview">
              <p>
                <strong>Product link:</strong>{" "}
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.link}
                </a>
              </p>
              {previews[item._id] && (
                <div className="url-metadata">
                  {previews[item._id].images && previews[item._id].images.length > 0 && (
                    <img src={previews[item._id].images[0]} alt="Preview" />
                  )}
                  <p>{previews[item._id].title}</p>
                  <p>{previews[item._id].description}</p>
                </div>
              )}
            </div>
          )}

          {item.price && <p><strong>Price:</strong> ${item.price}</p>}
          {item.images && item.images.length > 0 && (
            <div className="image-gallery">
              <strong>Images:</strong>
              {item.images.map((image, index) => (
                <img key={index} src={image.asset.url} alt={`Image ${index + 1}`} />
              ))}
            </div>
          )}
          <button onClick={() => onDelete(item._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
