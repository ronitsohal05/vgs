import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard';

export default function UserListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // delete handler passed into each card
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // remove from local state
      setListings(ls => ls.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete listing', err);
      alert('Could not delete listing');
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setListings([]);
          return;
        }
        const res = await axios.get('http://localhost:8080/listings/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <p>Loading your listings...</p>;
  if (error)   return <p className="text-red-600">{error}</p>;
  if (!listings.length) return <p>No user listings.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {listings.map(item => (
        <ListingCard
          key={item.id}
          listing={item}
          showDelete = {true}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}