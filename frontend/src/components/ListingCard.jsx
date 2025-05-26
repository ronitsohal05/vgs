// src/components/ListingCard.jsx
import React from 'react';

export default function ListingCard({ listing }) {
  // parse and format the ISO date string
  const date = new Date(listing.datePosted);
  const formatted = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const price = typeof listing.price === 'number'
    ? listing.price.toFixed(2)
    : parseFloat(listing.price).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={listing.imageUrls?.[0] || '/placeholder.jpg'}
        alt={listing.title}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="mt-2 font-semibold text-lg">{listing.title}</h3>
      <p className="text-gray-500 text-sm">Posted: {formatted}</p>
      <p className="mt-1 text-blue-600 font-medium">${price}</p>
    </div>
  );
}
