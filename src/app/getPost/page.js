'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import ListOfFoundThings from '@/components/ListOfFoundThings';

export default function FoundThingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/getPosts'); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`/api/deletePost?id=${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
        alert('Item deleted successfully');
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <h1>Found Things</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        <ListOfFoundThings items={items} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}
