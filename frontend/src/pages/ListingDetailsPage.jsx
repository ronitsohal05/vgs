import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import NavBar from '../components/Navbar';

function ListingDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchListing() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListing(res.data);
      } catch (err) {
        console.error(err);
        setError('Could not load listing');
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  useEffect(() => {
    async function fetchOwner() {
      if (!listing?.ownerId) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/users/${listing.ownerId}`
        );
        setOwner(res.data);
      } catch (err) {
        console.error('Owner fetch failed', err);
      }
    }
    fetchOwner();
  }, [listing]);

  if (loading) return <p>Loading...</p>;
  if (error || !listing) return <p className="text-red-600">{error || 'Not found'}</p>;

  const images = Array.isArray(listing.imageUrls) ? listing.imageUrls : [];
  const prev = () => setIndex((index + images.length - 1) % images.length);
  const next = () => setIndex((index + 1) % images.length);
  const price = typeof listing.price === 'number'
    ? listing.price.toFixed(2)
    : parseFloat(listing.price).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            {images.length > 0 ? (
              <>
                <img
                  src={images[index]}
                  alt={`${listing.title} ${index + 1}`}
                  className="w-full h-80 object-cover rounded"
                />
                <button
                  onClick={prev}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
                ><FaChevronLeft /></button>
                <button
                  onClick={next}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
                ><FaChevronRight /></button>
              </>
            ) : (
              <div className="w-full h-80 bg-gray-200 rounded flex items-center justify-center">
                No Images
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
            <p className="text-xl text-blue-600 mb-4">${price}</p>
            <p className="mb-4">{listing.description}</p>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Owner</h2>
              {owner ? (
                <div className="flex flex-col items-start space-y-1">
                  {owner.profilePictureLink && (
                    <img
                      src={owner.profilePictureLink}
                      alt={`${owner.firstName} ${owner.lastName}`}
                      className="h-12 w-12 rounded-full mb-2"
                    />
                  )}
                  <span className="font-medium">
                    {owner.firstName} {owner.lastName}
                  </span>
                  <span className="text-sm text-gray-600">{owner.email}</span>
                  <span className="text-sm text-gray-600">{owner.university}</span>
                </div>
              ) : (
                <p>Loading owner info...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailsPage;
