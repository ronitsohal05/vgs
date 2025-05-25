import React from 'react';
import { useNavigate } from 'react-router-dom';

function ListingCard({ listing }) {
  const navigate = useNavigate();
  const price = typeof listing.price === 'number'
    ? listing.price.toFixed(2)
    : parseFloat(listing.price).toFixed(2);

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
      <p className="text-blue-600">${price}</p>
    </div>
  );
}

export default ListingCard;