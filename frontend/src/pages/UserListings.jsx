import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log(res.data);
        setListings(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <p>Loading your listings...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!listings.length) {
    return <p>No user listings.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {listings.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4">
          <img
            src={item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '/placeholder.jpg'}
            alt={item.title}
            className="h-40 w-full object-cover rounded"
          />
          <h3 className="mt-2 font-semibold">{item.title}</h3>
          <p className="text-blue-600">${item.price}</p>
        </div>
      ))}
    </div>
  );
}
