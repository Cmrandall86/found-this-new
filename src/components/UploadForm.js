// components/UploadForm.js
import React, { useState } from 'react';
import '../../styles/uploadform.css'

export default function UploadForm({ onSubmit }) {
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    productURL: '',
    price: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPost);
    setNewPost({ title: '', description: '', productURL: '', price: '' }); // Clear form after submit
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={newPost.title}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={newPost.description}
          onChange={handleChange}
          required
          className="form-textarea"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="productURL" className="form-label">
          Product Link:
        </label>
        <input
          type="url"
          id="productURL"
          name="productURL"
          value={newPost.productURL}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="price" className="form-label">
          Price:
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={newPost.price}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}
