// src/components/ListingCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ListingCard({ listing }) {
  const navigate = useNavigate();
  const price = typeof listing.price === 'number'
    ? listing.price.toFixed(2)
    : parseFloat(listing.price).toFixed(2);

  const dateStr = listing.datePosted;
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg"
      onClick={() => navigate(`/listings/${listing.id}`)}
    >
      <img
        src={
          Array.isArray(listing.imageUrls) && listing.imageUrls.length > 0
            ? listing.imageUrls[0]
            : '/placeholder.jpg'
        }
        alt={listing.title}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="mt-2 font-semibold">{listing.title}</h3>
      {formattedDate && (
        <p className="text-gray-500 text-xs mt-1">{formattedDate}</p>
      )}
      <p className="text-blue-600 mt-1">${price}</p>
    </div>
  );
}

export default ListingCard;
