import React from "react";

export default function ListOfFoundThings({ items, onDelete }) {
  return (
    <ul className="found-things-list">
      {items.map((item) => (
        <li key={item._id} className="found-thing-item">
          <h2>{item.title}</h2>
          <p><strong>Description:</strong> {item.description}</p>

          {item.productURL && (
            <div className="url-preview">
              <a href={item.productURL} target="_blank" rel="noopener noreferrer">
                Click here to view product
              </a>
            </div>
          )}

          {item.price && <p><strong>Price:</strong> ${item.price}</p>}
          
          <button onClick={() => onDelete(item._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
