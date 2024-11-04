'use client';
import React, { useState, useEffect } from 'react';
import ListOfFoundThings from '@/components/ListOfFoundThings'; // Adjust the import path as necessary

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', description: '', link: '', price: '' });

  useEffect(() => {
    // Fetch posts from the API route
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/getPosts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
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
          _type: 'reference',
          _ref: '446810ab-8ae8-4fa2-85bf-46e0d04bd72d', // Replace 'authorId' with actual data or selection from UI
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
  
      const response = await fetch('/api/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPostWithSchema),
      });
  
      if (response.ok) {
        alert('Post created successfully!');
        setNewPost({ title: '', description: '', productLinks: '', price: '', images: [] });
        const updatedPost = await response.json();
        setPosts([...posts, updatedPost]);
      } else {
        alert('Failed to create post.');
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
        alert('Post deleted successfully');
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h1>Product Deals</h1>
      {/* Use ListOfFoundThings to display posts */}
      <ListOfFoundThings items={posts} onDelete={handleDelete} />

      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={newPost.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={newPost.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Product Link:</label>
          <input type="url" name="link" value={newPost.link} onChange={handleChange} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={newPost.price} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
