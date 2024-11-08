'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
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
    setFormVisible((prev) => !prev);
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
          authorId: '446810ab-8ae8-4fa2-85bf-46e0d04bd72d',
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) => [...prevPosts, updatedPost]);
        handleToggleForm();
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
    <div>
      <Navbar isFormVisible={isFormVisible} toggleFormVisibility={handleToggleForm} />

      <div className="container-flex">
        {/* Left Column for Form */}
        {isFormVisible && (
          <div className="left-column visible">
            <div className='close-button-container'>
            <button onClick={handleToggleForm} className="close-form">
              X
            </button>
            </div>
            <UploadForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* Right Column for Displaying Posts */}
        <div className={`right-column ${isFormVisible ? '' : 'expanded'}`}>
          <h1 className="main-title">Curated Finds</h1>
          <ListOfFoundThings items={posts} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
