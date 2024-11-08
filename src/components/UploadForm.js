import React, { useState, useEffect } from 'react';
import '../../styles/globals.css'
import '../../styles/uploadform.css'

export default function UploadForm({ onSubmit, editPost }) {
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    productURL: '',
    price: '',
  });

  useEffect(() => {
    if (editPost) {
      // Pre-fill form with data when editing
      setFormValues({
        title: editPost.title,
        description: editPost.description,
        productURL: editPost.productURL,
        price: editPost.price,
      });
    }
  }, [editPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues); // Pass form values to the parent
    setFormValues({ title: '', description: '', productURL: '', price: '' }); // Clear form
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
      <button type="submit" className="submit-button">
        {editPost ? 'Update Post' : 'Add Post'}
      </button>
    </form>
  );
}
