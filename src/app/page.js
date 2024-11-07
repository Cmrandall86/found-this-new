"use client";
import React, { useState, useEffect } from "react";
import ListOfFoundThings from "@/components/ListOfFoundThings";
import Navbar from "@/components/Navbar";
import './globals.css';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", description: "", productURL: "", price: "" });
  const [previewData, setPreviewData] = useState(null); // Store preview data temporarily
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/getPosts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts:", response.statusText);
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  // Fetch preview data dynamically for a given URL
  const fetchPreviewData = async (url) => {
    try {
      const response = await fetch(`/api/fetchPreview?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setPreviewData({
        title: data.title || "No title",
        description: data.description || "No description",
        images: data.images.slice(0, 4), // Limit to 4 images
      });
    } catch (error) {
      console.error("Error fetching preview data:", error);
      setPreviewData(null);
    }
  };

  // Fetch preview data when the product URL field loses focus
  const handleProductURLBlur = () => {
    if (newPost.productURL) {
      fetchPreviewData(newPost.productURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPostData = {
        title: newPost.title,
        description: newPost.description,
        productURL: newPost.productURL,
        price: Number(newPost.price),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPostData),
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts((prevPosts) => [...prevPosts, createdPost]);
        setNewPost({ title: "", description: "", productURL: "", price: "" });
        setPreviewData(null); // Clear preview data after submit
      } else {
        console.error("Failed to create post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/deletePost?id=${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } else {
        console.error("Failed to delete post:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <div>
      <Navbar isFormVisible={isFormVisible} toggleFormVisibility={toggleFormVisibility} />

      <div className="container-flex">
        {/* Form for Adding New Post (Left Side) */}
        <div className={`left-column ${isFormVisible ? "visible" : "hidden"}`}>
          <div className="close-form">
            <button onClick={toggleFormVisibility} className="toggle-button close-form">
              X
            </button>
          </div>

          {isFormVisible && (
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
                  onBlur={handleProductURLBlur}
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

              {/* Preview Data */}
              {previewData && (
                <div className="preview-section">
                  <h4>Preview</h4>
                  <p><strong>{previewData.title}</strong></p>
                  <p>{previewData.description}</p>
                  <div className="preview-images">
                    {previewData.images.map((image, index) => (
                      <img key={index} src={image} alt="Preview" className="preview-image" />
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Display List of Found Items (Right Side) */}
        <div className={`right-column ${isFormVisible ? "" : "expanded"}`}>
          <h1 className="main-title">Curated Finds</h1>
          <ListOfFoundThings key={posts.length} items={posts} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
