"use client";
import React, { useState, useEffect } from "react";
import ListOfFoundThings from "@/components/ListOfFoundThings"; // Adjust the import path as necessary

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", description: "", link: "", price: "" });

  useEffect(() => {
    // Fetch posts from the API route
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/getPosts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
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
        ...newPost,
        author: {
          _type: "reference",
          _ref: "446810ab-8ae8-4fa2-85bf-46e0d04bd72d", // Replace 'authorId' with actual data or selection from UI
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPostWithSchema),
      });

      if (response.ok) {
        alert("Post created successfully!");
        setNewPost({ title: "", description: "", productLinks: "", price: "", images: [] });
        const updatedPost = await response.json();
        setPosts([...posts, updatedPost]);
      } else {
        alert("Failed to create post.");
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
        if (confirm("Are you sure you want to delete this?")) {
          setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        }
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container-flex">
      <div className="left-column">
        <h1 className="main-title">Product Deals</h1>
        <h2 className="form-title">Add a New Post</h2>
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
            <label htmlFor="link" className="form-label">
              Product Link:
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={newPost.link}
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
      </div>

      <div className="right-column">
        {/* Use ListOfFoundThings to display posts */}
        <ListOfFoundThings items={posts} onDelete={handleDelete} />
      </div>
    </div>
  );
}
