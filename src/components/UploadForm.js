import React, { useState, useEffect } from 'react';
import '../../styles/globals.css';
import '../../styles/uploadform.css';

export default function UploadForm({ onSubmit, editPost, onClose }) { // Add onClose prop
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    productURL: '',
    price: '',
    tags: '', // Field for tags
  });

  useEffect(() => {
    if (editPost) {
      setFormValues({
        title: editPost.title || '',
        description: editPost.description || '',
        productURL: editPost.productURL || '',
        price: editPost.price || '',
        tags: editPost.tags ? editPost.tags.join(', ') : '', // Convert tags array to a comma-separated string
      });
    }
  }, [editPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredTags = formValues.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== ''); // Remove empty strings

    // Call onClose immediately to close the form
    if (onClose) onClose();

    // Submit the form data
    onSubmit({
      ...formValues,
      tags: filteredTags, // Use filtered tags
    });

    // Reset form
    setFormValues({ title: '', description: '', productURL: '', price: '', tags: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="title" className="form-label">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description" className="form-label">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          required
          className="form-textarea"
        />
      </div>
      <div className="form-group">
        <label htmlFor="productURL" className="form-label">Product Link:</label>
        <input
          type="url"
          id="productURL"
          name="productURL"
          value={formValues.productURL}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="price" className="form-label">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formValues.price}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="tags" className="form-label">Tags (comma-separated):</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formValues.tags}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <button type="submit" className="submit-button">
        {editPost ? 'Update Post' : 'Add Post'}
      </button>
    </form>
  );
}
