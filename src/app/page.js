"use client";
import React, { useState, useEffect } from "react";
import ListOfFoundThings from "@/components/ListOfFoundThings"; // Adjust the import path as necessary
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", description: "", productURL: "", price: "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPostWithSchema = {
        title: newPost.title,
        description: newPost.description,
        productURL: newPost.productURL,
        price: Number(newPost.price),
        authorId: "446810ab-8ae8-4fa2-85bf-46e0d04bd72d", // Replace dynamically in the future
      };

      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPostWithSchema),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) => [...prevPosts, updatedPost]);
        setNewPost({ title: "", description: "", productURL: "", price: "" }); // Clear form after submit
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
      <Navbar
        isFormVisible={isFormVisible}
        toggleFormVisibility={toggleFormVisibility}
      />


      <div className="container-flex">
        {/* Form for Adding New Post (Left Side) */}
        <div className={`left-column ${isFormVisible ? "visible" : "hidden"}`}>
          <div className="close-form">
          <button onClick={toggleFormVisibility} className="toggle-button">
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
