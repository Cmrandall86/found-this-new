'use client'
// pages/HomePage.js
import React, { useState, useEffect } from 'react';
import ListOfFoundThings from '@/components/ListOfFoundThings';
import UploadForm from '@/components/UploadForm';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/getPosts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts:', response.statusText);
      }
    };
    fetchPosts();
  }, []);

  const handleToggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const handleFormSubmit = async (newPost) => {
    try {
      const response = await fetch('/api/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPost,
          price: Number(newPost.price),
          authorId: '446810ab-8ae8-4fa2-85bf-46e0d04bd72d', // Replace dynamically in the future
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) => [...prevPosts, updatedPost]);
        handleToggleForm(); // Hide form after submission
      } else {
        console.error('Failed to create post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/deletePost?id=${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container-flex">
      <div className="right-column">
        <h1 className="main-title">Curated Finds</h1>
        <ListOfFoundThings items={posts} onDelete={handleDelete} />
      </div>
      
      {isFormVisible && (
        <div className="left-column">
          <button onClick={handleToggleForm} className="close-form">
            Close Form
          </button>
          <UploadForm onSubmit={handleFormSubmit} />
        </div>
      )}
      
      {!isFormVisible && (
        <button onClick={handleToggleForm} className="show-form-button">
          Add New Post
        </button>
      )}
    </div>
  );
}
