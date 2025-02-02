"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ListOfFoundThings from "@/components/ListOfFoundThings";
import UploadForm from "@/components/UploadForm";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editPost, setEditPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/getPosts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
            prevPosts.map((post) => 
              post._id === updatedPost._id ? updatedPost : post
            )
          );
        }
      } else {
        const response = await fetch("/api/createPost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newPost,
            price: Number(newPost.price),
            createdAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const createdPost = await response.json();
          setPosts((prevPosts) => [...prevPosts, createdPost]);
        }
      }
      setFormVisible(false);
      setEditPost(null);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/deletePost?id=${postId}`, { 
        method: "DELETE" 
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setFormVisible(true);
  };

  const handleToggleForm = () => {
    setFormVisible((prev) => !prev);
    if (isFormVisible) {
      setEditPost(null);
    }
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
                onClose={() => setFormVisible(false)}
              />
            </>
          )}
        </div>

        <div className={`right-column ${isFormVisible ? "" : "expanded"}`}>
          <div className="outer-scroll">
            <ListOfFoundThings 
              items={posts} 
              onDelete={handleDelete} 
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
