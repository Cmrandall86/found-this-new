"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ListOfFoundThings from "@/components/ListOfFoundThings";
import UploadForm from "@/components/UploadForm";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editPost, setEditPost] = useState(null);

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


  const handleToggleForm = () => {
    setFormVisible((prev) => !prev);
    if (isFormVisible) setEditPost(null); // Reset editPost if closing form
  };

  const handleFormSubmit = async (newPost) => {
    try {
      if (editPost) {
        const response = await fetch("/api/updatePost", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newPost,
            id: editPost._id,
            price: Number(newPost.price),
            updatedAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const updatedPost = await response.json();
          setPosts((prevPosts) =>
            prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
          );
        } else {
          console.error("Failed to update post:", response.statusText);
        }
      } else {
        const response = await fetch("/api/createPost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newPost,
            price: Number(newPost.price),
            authorId: "446810ab-8ae8-4fa2-85bf-46e0d04bd72d",
          }),
        });

        if (response.ok) {
          const createdPost = await response.json();
          setPosts((prevPosts) => [...prevPosts, createdPost]);
        } else {
          console.error("Failed to create post:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/deletePost?id=${postId}`, { method: "DELETE" });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } else {
        console.error("Failed to delete post:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setFormVisible(true);
  };

  return (
    <div className="homePage">
      <Navbar isFormVisible={isFormVisible} toggleFormVisibility={handleToggleForm} />
      <div className="container-flex content">
        <div className={`left-column ${isFormVisible ? "visible" : "hidden"}`}>
          {isFormVisible && (
            <>
              <button onClick={handleToggleForm} className="close-form">
                X
              </button>
              <UploadForm
                onSubmit={handleFormSubmit}
                editPost={editPost}
                onClose={() => setFormVisible(false)} // Close form immediately after submission
              />
            </>
          )}
        </div>

        <div className={`right-column ${isFormVisible ? "" : "expanded"}`}>
          <div className="outer-scroll">
            <ListOfFoundThings items={posts} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        </div>
      </div>
    </div>
  );
}
