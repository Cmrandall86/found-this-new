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
        price: typeof editPost.price === 'number' ? editPost.price.toFixed(2) : '',
        tags: editPost.tags ? editPost.tags.join(', ') : '', // Convert tags array to a comma-separated string
      });
    }
  }, [editPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for price input
    if (name === 'price') {
      // Allow empty string or numbers with up to 2 decimal places
      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
        setFormValues({ ...formValues, [name]: value });
      }
      return;
    }

    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredTags = formValues.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== ''); // Remove empty strings

    // Format the price as a number with 2 decimal places
    const formattedPrice = formValues.price ? Number(parseFloat(formValues.price).toFixed(2)) : 0;

    // Call onClose immediately to close the form
    if (onClose) onClose();

    // Submit the form data
    onSubmit({
      ...formValues,
      price: formattedPrice, // Send the properly formatted price
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
          type="text" // Changed from "number" to "text" for better decimal control
          id="price"
          name="price"
          value={formValues.price}
          onChange={handleChange}
          placeholder="0.00"
          pattern="^\d*\.?\d{0,2}$" // Allow numbers with up to 2 decimal places
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
