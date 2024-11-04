import React from "react";

export default function ListOfFoundThings({ items, onDelete }) {
    return (
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
            <button onClick={() => onDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    );
  }
  