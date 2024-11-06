"use client";
import React, { useState, useEffect } from "react";
import ListOfFoundThings from "@/components/ListOfFoundThings"; // Adjust the import path as necessary

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", description: "", productURL: "", price: "" });
  const [isFormVisible, setFormVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
      document.body.classList.add(storedTheme === "dark" ? "dark-mode" : "light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light-mode" : "dark-mode";
    setIsDarkMode(!isDarkMode);
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };
  
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
      <div className="btns">
        <div className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? (
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12 2a9.956 9.956 0 0 1 4.916 1.336 1 1 0 0 1-.19 1.741 7.962 7.962 0 1 0 5.243 7.525 9.974 9.974 0 0 1-9.969 9.398A10 10 0 0 1 12 2z"></path>
            </svg>
          ) : (
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M6.76 4.84l-1.41-1.41-2.83 2.83 1.41 1.41L6.76 4.84zM1 13h3v-2H1v2zm10-8h2V1h-2v4zm7.24-2.17l1.41-1.41 2.83 2.83-1.41 1.41-2.83-2.83zM21 11v2h3v-2h-3zm-2.76 7.76l1.41 1.41-2.83 2.83-1.41-1.41 2.83-2.83zM13 23v-3h-2v3h2zm-7.24-2.17l2.83 2.83-1.41 1.41-2.83-2.83 1.41-1.41z"></path>
              <circle cx="12" cy="12" r="5"></circle>
            </svg>
          )}
        </div>
        <button onClick={() => setFormVisible(!isFormVisible)} className="show-form-button">
          {isFormVisible ? "Hide Form" : "Add New Post"}
        </button>
      </div>
      <div className="container-flex">
        {/* Form for Adding New Post (Left Side) */}
        <div className={`left-column ${isFormVisible ? "visible" : "hidden"}`}>
          <button onClick={toggleFormVisibility} className="toggle-button">
            Hide Form
          </button>
  
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
